import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { ITreeGridProps, ITreeGridState, TreeNode } from './TreeGrid.Props';

// import { getTreeRowsSelector, getNodeChildrenRecursively, getNodeLevel } from './treeGridDataSelectors';
import { Icon } from '../Icon/Icon';
import { QuickGrid, IQuickGridProps, SortDirection, GridColumn } from '../QuickGrid';
import { DataTypeEnum } from '../QuickGrid/QuickGrid.Props';


export class TreeGrid extends React.PureComponent<ITreeGridProps, ITreeGridState> {

    private finalGridRows: Array<any>;
    constructor(props: ITreeGridProps) {
        super(props);
        this.state = {
            columnsToDisplay: this.getTreeColumnsToDisplay(props.columns),
            collapsedTreeNodes: [],
            sortColumn: props.sortColumn,
            sortDirection: props.sortDirection
        };
        this.finalGridRows = this.getTreeRowsSelector(this.state, props);
    }

    getTreeColumnsToDisplay(columns: Array<GridColumn>) {
        let emptyArray = new Array();
        emptyArray.push({
            isSortable: false,
            width: 18,
            minWidth: 28,
            fixedWidth: true
        });
        emptyArray.push({
            dataType: DataTypeEnum.String,
            valueMember: 'TreeId',
            headerText: 'TreeId',
            width: 0
        });
        columns = emptyArray.concat(columns);
        return columns;
    }

    componentWillUpdate(nextProps, nextState) {
        this.finalGridRows = this.getTreeRowsSelector(nextState.sortColumn, nextState.sortDirection);
    }

    treeCellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const rowData = this.finalGridRows[rowIndex]; 
        const rowID: string = !rowData.TreeId ? '' : rowData.TreeId;
        const indentSize = 20;
        let indent = 0;
        let level = this.getNodeLevel(rowData, this.finalGridRows);
        if ((columnIndex === 0 || columnIndex === 2)) {

            indent = level * indentSize;     
        }
        let shouldIndent: boolean = false;
        if (columnIndex === 0) {
            if (level === 0) {
                shouldIndent = false;
            } else if (style.left < indent) {
                shouldIndent = true;
            }
        } else if (columnIndex === 2) {
            if (level === 0) {
                shouldIndent = false;
            } else if (style.left < (indent + indentSize)) {
                shouldIndent = true;
            }
        }
        if (columnIndex === 1) {
            return this.renderHiddenTreeCell(key, columnIndex, rowID);     
        }
        if (columnIndex === 2 && shouldIndent) {
                style = {...style, width: style.width - indent};
        }      
        if (shouldIndent) {
            style = {...style, left: style.left + indent};
        }
        if (columnIndex === 0) {
            return this.renderActionTreeCell(key, rowIndex, rowData, style);
        }
        return this.renderBodyCell(columnIndex, key, rowIndex, rowData, style);     
    }

    renderHiddenTreeCell(key, columnIndex, rowData) {
        const style = {
            display: 'none'
        };
        return (
        <div key={key} style={style}> 
            {rowData}
        </div>);
    }

    renderActionTreeCell(key, rowIndex: number, rowData: TreeNode, style) {
        let actionsTooltip = rowData.IsExpanded ? 'Collapse' : 'Expand';
        let iconName = rowData.IsExpanded ? 'icon-arrow_down' : 'icon-arrow_right';
        let icon = null;
        
        if (rowData.leaves.length <= 0 && rowData.IsExpanded) {
            icon = null;
            actionsTooltip = null;
        } else {
            icon = <Icon iconName={iconName} className="expand-collapse-action-icon" />;
        }
        const rowClass = 'grid-row-' + rowIndex;
        const onMouseEnter = () => { this.onMouseEnterCell(rowClass); };
        const onMouseLeave = () => { this.onMouseLeaveCell(rowClass); };
        const onToggleTreeRow = () => { this.onTreeExpandToggleClick(rowData); };
        const title = actionsTooltip;
        const className = classNames(
            'grid-component-cell',
            rowClass,
            { 'is-selected': rowIndex === this.state.selectedRowIndex }
        );
        return (
            <div
                key={key}
                style={style}
                className={className}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                title={title}
                onClick={icon ? onToggleTreeRow : null}
            >
                {icon}
            </div>
        );
    }

    renderBodyCell(columnIndex: number, key, rowIndex: number, rowData, style) {
        const columns = this.state.columnsToDisplay;
        const notLastIndex = columnIndex < (columns.length - 1);
        const column = columns[columnIndex];
        const dataKey = column.dataMember || column.valueMember;
        const cellData = rowData[dataKey];
        const rowClass = 'grid-row-' + rowIndex;
        const className = classNames(
            'grid-component-cell',
            rowClass,
            column.cellClassName,
            { 'border-column-cell': notLastIndex },
            { 'is-selected': rowIndex === this.state.selectedRowIndex });

        const onMouseEnter = () => { this.onMouseEnterCell(rowClass); };
        const onMouseLeave = () => { this.onMouseLeaveCell(rowClass); };
        const onClick = () => { this.setSelectedRowIndex(rowIndex); };

        const onDoubleClick = () => {
            if (this.props.onRowDoubleClicked) {
                this.props.onRowDoubleClicked(rowData);
            }
        };

        const columnElement = () => {
            if (column.cellFormatter) {
                return column.cellFormatter(cellData);
            } else {
                return (
                    <div style={{ padding: '3px 5px 0 5px' }} >
                        {cellData}
                    </div>
                );
            }
        };
        const title = cellData;
        return (
            <div
                key={key}
                style={style}
                className={className}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                title={title}
            >
                {columnElement()}
            </div>
        );
    }

    setSelectedRowIndex = (rowIndex: number) => {
        this.setState((prevState) => { return { ...prevState, selectedRowIndex: rowIndex }; });
        if (this.props.onSelectedRowChanged) {
            this.props.onSelectedRowChanged(rowIndex);
        }
    }

    onTreeExpandToggleClick = (rowData: TreeNode) => {
        this.setState((oldState) => {
            let index: number;
            let rows: Array<TreeNode>;
            let collapsedNodes = [...oldState.collapsedTreeNodes];
            let oldNodes = rowData.IsExpanded ? [...this.finalGridRows] : collapsedNodes;

            rows = this.getNodeChildrenRecursively(oldNodes, rowData.TreeId);

            for (let i = 0; i < rows.length; i++) {
                index = collapsedNodes.indexOf(rows[i], 0);
                if (!rowData.IsExpanded) {
                    collapsedNodes.splice(index, 1);
                } else if (index < 0) {
                    collapsedNodes.push(rows[i]);
                }
                rows[i].IsExpanded = !rowData.IsExpanded;            
            }

            rowData.IsExpanded = !rowData.IsExpanded;

            return { ...oldState, collapsedTreeNodes: collapsedNodes };
        });
    }

    onMouseEnterCell = (rowClass) => {
        const rowElements = document.getElementsByClassName(rowClass);
        for (let i = 0; i < rowElements.length; i++) {
            rowElements[i].classList.add('is-hover');
        }
    }

    onMouseLeaveCell = (rowClass) => {
        const rowElements = document.getElementsByClassName(rowClass);
        for (let i = 0; i < rowElements.length; i++) {
            const classList = rowElements[i].classList;
            if (classList.contains('is-hover')) {
                classList.remove('is-hover');
            }
        }
    }


    sortData = (treeData: Array<TreeNode>, sortColumn: string, sortDirection: SortDirection, collapsedTreeNodes: Array<TreeNode>) => {
        const sortedTree = this.sortTree(treeData, sortColumn, sortDirection);
        const flattenedData = this.flatten(sortedTree);
        return flattenedData.filter(row => { return collapsedTreeNodes.indexOf(row) < 0; } );
    }
    
    sortTree = (tree: Array<TreeNode>, sortColumn: string, sortDirection: SortDirection): Array<TreeNode> => {
        let newTree: Array<TreeNode> = [];
        for (let leaf of tree) {
            if (leaf.leaves && leaf.leaves.length > 0) {
                leaf.leaves = this.sortTree(leaf.leaves, sortColumn, sortDirection);
            }
            newTree = this.sort([...tree], sortDirection, sortColumn);
        }
        return newTree;
    }
    
    sort = (input, sortDirection, sortColumn) => {
        const sortModifier = sortDirection === SortDirection.Descending ? -1 : 1;
        const sortFunction = (a, b) => {
            if (sortColumn === undefined) {
                sortColumn = 'TreeId';
            }
            let valueA = a[sortColumn];
            let valueB = b[sortColumn];
            if (valueA < valueB) {
                return -1 * sortModifier;
            }
            if (valueA > valueB) {
                return 1 * sortModifier;
            }        
            return 0;
        };
        return [...input].sort(sortFunction);
    }
    
    getNodeChildrenRecursively(tree: Array<TreeNode>, id): Array<TreeNode> {
        let result = [];
        for (let leaf of tree) {
            if (leaf.ParentId === id) {
                result.push(leaf);
                if (leaf.leaves.length > 0) {
                    result = result.concat(this.getNodeChildrenRecursively(leaf.leaves, leaf.TreeId));
                }
            }
        }
        return result;
    }
    
    getNodeLevel(node: TreeNode, tree: Array<TreeNode>): number {
        let level = 0;
        while (node.ParentId !== null) {
            level++;
            node = tree.find(parent => parent.TreeId === node.ParentId);
        }
        return level;
    }
    
    flatten(tree): Array<TreeNode> {
        let result = [];      
        for (let leaf of tree) {
            result.push(leaf);
            if (leaf.leaves && leaf.leaves.length > 0) {
                const leaves = this.flatten(leaf.leaves);
                result = result.concat(leaves);
            }
        }
        return result;         
    }
    
    getTreeRowsSelector = (sortColumn, sortDirection) => {
        return this.sortData(this.props.tree, sortColumn, sortDirection, this.state.collapsedTreeNodes);
    }

    public render(): JSX.Element {
        return (
                <QuickGrid
                    rows={this.finalGridRows}
                    columns={this.state.columnsToDisplay}
                    sortDirection={this.state.sortDirection}
                    sortColumn={this.state.sortColumn}
                    tooltipsEnabled={false}
                    customCellRenderer={this.treeCellRenderer}
                    customRowSelector={this.getTreeRowsSelector}
                    hasStaticColumns={true}
                />
        );
    }
}
