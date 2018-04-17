import * as classNames from 'classnames';
import * as React from 'react';

import { IFinalTreeNode } from '../../models/TreeData';
import { getTreeRowsSelector } from './TreeGridDataSelectors';
import { Icon } from '../Icon/Icon';
import { getColumnMinWidth, GridColumn, ICustomCellRendererArgs, IQuickGrid, QuickGrid, DataTypeEnum, QuickGridInner } from '../QuickGrid';
import { Spinner } from '../Spinner/Spinner';
import { SpinnerType } from '../Spinner/Spinner.Props';
import { CellElement } from './CellElement';
import { ITreeGridProps, ITreeGridState } from './TreeGrid.Props';

export class TreeGrid extends React.PureComponent<ITreeGridProps, ITreeGridState> {
    public static defaultProps = {
        isNodeSelectable: true
    };

    private _quickGrid: IQuickGrid;
    private _finalGridRows: Array<IFinalTreeNode>;
    private _maxExpandedLevel: number;
    private _overscanProps = {
        // we are setting the overscanColumn property in hope of rendering the expand collapse column
        overscanColumnCount: 3,
        // but for some reason, setting the overscanColumnCount property is not enough
        // and we need some additional custom logic
        overscanIndicesGetter: ({ direction, cellCount, scrollDirection, overscanCellsCount, startIndex, stopIndex }) => {
            return {
                overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
                overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
            };
        }
    };

    constructor(props: ITreeGridProps) {
        super(props);
        this.state = {
            columnsToDisplay: this._getTreeColumnsToDisplay(props.columns),
            sortColumn: props.sortColumn,
            sortDirection: props.sortDirection,
            sortRequestId: 0,
            structureRequestChangeId: 0,
            selectedNodeId: props.selectedNodeId
        };
        const result = getTreeRowsSelector(this.state, props, props);
        this._finalGridRows = result.data;
        this._maxExpandedLevel = result.maxExpandedLevel;
    }

    componentDidMount() {
        const rowIndex = this._finalGridRows.findIndex(e => e.nodeId === this.state.selectedNodeId);
        this._quickGrid.scrollToRow(rowIndex);
    }

    componentWillMount() {
        if (this.props.isNodeSelectable) {
            if (this.state.selectedNodeId > 0) {
                this._setSelectedNodeAndState(this.state.selectedNodeId);
            }
        }
    }

    private _getTreeColumnsToDisplay(columns: Array<GridColumn>) {
        let expandedColumns = new Array();
        expandedColumns.push({
            isSortable: false,
            width: 16,
            minWidth: 16,
            fixedWidth: true
        });
        const replacementFirstColumn: GridColumn = {
            ...columns[0],
            minWidth: () => {
                const calculated = getColumnMinWidth(columns[0]);
                let minWidth = 20 + this._maxExpandedLevel * 20 + 40;
                return Math.max(minWidth, calculated);
            }
        };
        expandedColumns.push(replacementFirstColumn);
        for (let i = 1; i < columns.length; i++) {
            expandedColumns.push(columns[i]);
        }
        return expandedColumns;
    }

    public componentWillReceiveProps(nextProps) {
        if (this.props.treeDataSource !== nextProps.treeDataSource || this.props.filterString !== nextProps.filterString) {
            this.setState(oldState => ({ sortRequestId: oldState.sortRequestId + 1, structureRequestChangeId: oldState.structureRequestChangeId + 1 }));
        }
    }

    public componentWillUpdate(nextProps, nextState) {
        const result = getTreeRowsSelector(nextState, nextProps, this.props);
        this._finalGridRows = result.data;
        this._maxExpandedLevel = result.maxExpandedLevel;
        this._quickGrid.updateColumnWidth(1, (old) => {
            return Math.max(old, getColumnMinWidth(this.state.columnsToDisplay[1]));
        });
        if (this.props.selectedNodeId !== nextProps.selectedNodeId && this.props.isNodeSelectable) {
            this._setSelectedNodeAndState(nextProps.selectedNodeId);
        }
    }

    treeCellRenderer = (args: ICustomCellRendererArgs) => {
        let { columnIndex, key, rowIndex, style, onMouseEnter, rowActionsRender, onMouseClick } = args;
        const rowData = this._finalGridRows[rowIndex];
        const rowID: number = rowData.nodeId;
        let isSelectedRow = this.state.selectedNodeId && this.state.selectedNodeId === rowData.nodeId;
        const indentSize = 20;
        let indent = 0;
        let level = rowData.nodeLevel;
        if ((columnIndex === 0 || columnIndex === 1)) {

            indent = level * indentSize;
        }
        let shouldIndent: boolean = false;
        if (columnIndex === 0) {
            if (level === 0) {
                shouldIndent = false;
            } else if (style.left < indent) {
                shouldIndent = true;
            }
        } else if (columnIndex === 1) {
            if (level === 0) {
                shouldIndent = false;
            } else if (style.left < (indent + indentSize)) {
                shouldIndent = true;
            }
        }
        if (columnIndex === 1 && shouldIndent) {
            style = { ...style, width: style.width - indent };
        }
        if (shouldIndent) {
            style = { ...style, left: style.left + indent };
        }
        if (columnIndex === 0) {
            return this._renderExpandCollapseButton(key, rowIndex, rowData, style, onMouseEnter, isSelectedRow);
        }

        return this._renderBodyCell(columnIndex, key, rowIndex, rowData, style, onMouseEnter, rowActionsRender, isSelectedRow);
    }

    private _renderHiddenTreeCell(key, columnIndex, rowData) {
        const style = {
            display: 'none'
        };
        return (
            <div key={key} style={style}>
                {rowData}
            </div>);
    }

    private _renderExpandCollapseButton(key, rowIndex: number, rowData: IFinalTreeNode, style, onMouseEnter, isSelectedRow: boolean) {
        const showNodeAsExpanded = rowData.isExpanded || rowData.descendantSatisfiesFilterCondition;
        let actionsTooltip = showNodeAsExpanded ? 'Collapse' : 'Expand';
        let iconName = showNodeAsExpanded ? 'svg-icon-arrowCollapse' : 'svg-icon-arrowExpand';
        let icon = null;

        if ((!rowData.children || rowData.children.length <= 0) && !rowData.hasChildren) {
            icon = null;
            actionsTooltip = null;
        } else {
            icon = <Icon iconName={iconName} className="expand-collapse-action-icon" />;
        }
        const rowClass = 'grid-row-' + rowIndex;
        const title = actionsTooltip;
        const className = classNames(
            'grid-component-cell',
            'expand-collapse-cell',
            rowClass,
            { 'is-selected': isSelectedRow }
        );
        return (
            <CellElement
                key={key}
                id={key}
                style={style}
                className={className}
                title={title}
                onMouseEnter={onMouseEnter}
                onClick={icon ? this._onTreeExpandToggleClick : null}
                onClickParameter={rowData}
                rowClass={rowClass}
                rowData={rowData}
                rowIndex={rowIndex}
                element={icon}
            />
        );
    }

    private _renderBodyCell(columnIndex: number, key, rowIndex: number, rowData, style, onMouseEnter, rowActionsRender, isSelectedRow: boolean) {
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
            rowData.className,
            { 'border-column-cell': notLastIndex },
            { 'is-selected': isSelectedRow });

        let columnElement: any;
        let onCellClick = (e) => {
            // https://github.com/facebook/react/issues/1691 funky bussinese because of multiple mount points in the hover actions
            // so stopPropagation and preventDefault do not work there, manually checking if row actions were clicked
            if (this.props.isNodeSelectable) {
                if (e.currentTarget !== e.target) {
                    const rowActionsContainer = e.currentTarget.getElementsByClassName('hoverable-items-container__btn')[0];
                    if (rowActionsContainer && rowActionsContainer.contains(e.target)) {
                        return;
                    }
                }
                this._setSelectedNode(rowIndex, rowData);
            }
        };
        onCellClick = rowData.isAsyncLoadingDummyNode ? undefined : onCellClick;
        if (rowData.isAsyncLoadingDummyNode && columnIndex === 1) {
            columnElement = <div className="loading-container">
                <Spinner className="async-loading-spinner"
                    type={SpinnerType.small}
                />
                <span className="async-loading-label">
                    Loading...
                    </span>
            </div>;

        } else if (column.cellFormatter) {
            columnElement = column.cellFormatter(cellData, rowData);
        } else if (column.dataType === DataTypeEnum.Boolean) {
            columnElement = this._quickGrid.formatBoolCell(column, cellData);
        } else {
            columnElement = [
                columnIndex === 1 && rowData.iconName ? <span key="cellIcon" style={{ display: 'flex' }} title={rowData.iconTooltipContent}><Icon iconName={rowData.iconName} className={rowData.iconClassName} /></span> : null,
                <div key="cellData" className="grid-component-cell-inner" >
                    {cellData}
                </div>
            ];
            if (!notLastIndex && !rowData.isAsyncLoadingDummyNode) {
                columnElement.push(rowActionsRender(rowIndex, rowData, isSelectedRow));
            }
        }

        const title = typeof (cellData) === 'string' ? cellData : null;
        return (
            <CellElement
                key={key}
                id={key}
                style={style}
                className={className}
                title={title}
                onMouseEnter={onMouseEnter}
                onClick={onCellClick}
                onClickParameter={rowIndex}
                rowIndex={rowIndex}
                onRowDoubleClicked={this.props.onRowDoubleClicked}
                rowClass={rowClass}
                rowData={rowData}
                element={columnElement}
            />
        );
    }


    private _onTreeExpandToggleClick = (ev, rowData: IFinalTreeNode) => {
        // with this call we are telling underlying grid not to scroll on selected position on render update
        this._quickGrid.scrollToRow(undefined);
        // we are breaking immutability here and potential redux stores, but we need the performance
        rowData.isExpanded = !rowData.isExpanded;
        if (rowData.isExpanded
            && (!rowData.children || rowData.children.length === 0)
            && rowData.hasChildren
            && this.props.onLazyLoadChildNodes
            && !rowData.isLazyChildrenLoadInProgress) {
            rowData.isLazyChildrenLoadInProgress = true;
            this.props.onLazyLoadChildNodes(rowData);
        }
        this.setState((oldState) => {
            return { structureRequestChangeId: oldState.structureRequestChangeId + 1 };
        });
    }


    private _getQuickGridRef = (c) => { this._quickGrid = c; };

    private _getSortInfo = (newSortColumn, newSortDirection) => {
        this.setState(oldState => ({ sortColumn: newSortColumn, sortDirection: newSortDirection, sortRequestId: oldState.sortRequestId + 1 }));
    }

    private _setSelectedNode = (rowIndex: number, nodeData: IFinalTreeNode) => {
        if (this.state.selectedNodeId === nodeData.nodeId) {
            return;
        }
        this.setState({ selectedNodeId: nodeData.nodeId });
        if (this.props.onSelectedNodeChanged) {
            this.props.onSelectedNodeChanged(this._finalGridRows[rowIndex]);
        }
    }

    private _setSelectedNodeAndState = (nodeId: number) => {
        if (this.state.selectedNodeId === nodeId) {
            return;
        }
        this.setState({ selectedNodeId: nodeId });

        if (this.props.onSelectedNodeChanged) {
            const selectedNode = this._finalGridRows.find((element) => { return element.nodeId === nodeId; });
            this.props.onSelectedNodeChanged(selectedNode);
        }
        const selectedRowIndex = this._finalGridRows.findIndex((element) => element.nodeId === nodeId);

        this._quickGrid.scrollToRow(selectedRowIndex);
    }

    public render(): JSX.Element {
        return (
            <QuickGrid
                rows={this._finalGridRows}
                columns={this.state.columnsToDisplay}
                gridActions={this.props.gridActions}
                sortDirection={this.state.sortDirection}
                sortColumn={this.state.sortColumn}
                tooltipsEnabled={false}
                customCellRenderer={this.treeCellRenderer}
                hasCustomRowSelector={true}
                hasStaticColumns={true}
                customRowSorter={this._getSortInfo}
                columnSummaries={this.props.columnSummaries}
                columnHeadersVisible={this.props.columnHeadersVisible}
                isRowSelectable={this.props.isNodeSelectable}
                {...this._overscanProps}
                ref={this._getQuickGridRef}
            />
        );
    }
}
