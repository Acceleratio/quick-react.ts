import * as classNames from 'classnames';
import * as React from 'react';
import { CheckStatus } from '../..';
import { getObjectValue } from '../../utilities/getObjectValue';
import { Icon } from '../Icon/Icon';
import { DataTypeEnum, getColumnMinWidth, GridColumn, ICustomCellRendererArgs, IQuickGrid, QuickGrid } from '../QuickGrid';
import { boolFormatterFactory } from '../QuickGrid/CellFormatters';
import { Spinner } from '../Spinner/Spinner';
import { SpinnerType } from '../Spinner/Spinner.Props';
import { VirtualizedTreeViewCheckBox } from '../TreeFilter/VirtualizedTreeViewCheckBox';
import { CellElement } from './CellElement';
import { ITreeGridProps, ITreeGridState } from './TreeGrid.Props';
import { AugmentedTreeNode } from '../..';
import { getTreeRowsSelector } from './TreeGridDataSelectors';
import { nullFunc } from '../../utilities/common';

export class TreeGrid extends React.PureComponent<ITreeGridProps, ITreeGridState> {
    public static defaultProps = {
        isNodeSelectable: true,
        isMultiSelectable: false,
        highlightRowsInMultiSelect: true,
        onSelectedNodeChanged: nullFunc
    };

    private _quickGrid: IQuickGrid;
    private _finalGridRows: Array<AugmentedTreeNode>;
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

    public constructor(props: ITreeGridProps) {
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
        const rowIndex = this._finalGridRows.findIndex(e => e.$meta.nodeId === this.state.selectedNodeId);
        this._quickGrid.scrollToRow(rowIndex);
    }

    public componentWillMount() {
        this.props.treeDataSource.subscribe(this);
        this.props.treeDataSource.registerDataListener(this.props.onSelectedNodeChanged);

        if (this.props.isNodeSelectable) {
            if (this.state.selectedNodeId > 0) {
                this._setSelectedNodeAndState(this.state.selectedNodeId);
            }
        }
    }

    public componentWillUnmount() {
        this.props.treeDataSource.unsubscribe(this);
        this.props.treeDataSource.removeDataListener(this.props.onSelectedNodeChanged);
    }

    private _getTreeColumnsToDisplay(columns: Array<GridColumn>) {
        let expandedColumns = new Array();
        const fixedColumnWidth = this.props.isMultiSelectable ? 35 : 16;
        expandedColumns.push({
            isSortable: false,
            width: fixedColumnWidth,
            minWidth: fixedColumnWidth,
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
            let col: GridColumn = { ...columns[i] };
            if (col.cellFormatter == null && col.dataType === DataTypeEnum.Boolean) {
                col.cellFormatter = boolFormatterFactory(col.boolFormatType);
            }
            expandedColumns.push(col);
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

    private treeCellRenderer = (args: ICustomCellRendererArgs) => {
        let { columnIndex, key, rowIndex, style, onMouseEnter, rowActionsRender, onMouseClick } = args;
        const rowData = this._finalGridRows[rowIndex];
        let isSelectedRow;

        if (this.props.isMultiSelectable) {
            isSelectedRow = this.props.treeDataSource.SelectedNodes[rowData.$meta.nodeId];
        } else {
            isSelectedRow = this.state.selectedNodeId && this.state.selectedNodeId === rowData.$meta.nodeId;
        }

        const indentSize = 20;
        let indent = 0;
        let level = rowData.$meta.nodeLevel;
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
            </div>
        );
    }

    private getCheckStatus = (data: AugmentedTreeNode): CheckStatus => {
        if (this.props.treeDataSource.PartiallySelectedNodes[data.$meta.nodeId]) {
            return CheckStatus.ChildChecked;
        }

        const selectedNodes = this.props.treeDataSource.SelectedNodes;
        if (!selectedNodes.hasOwnProperty(data.$meta.nodeId)) {
            return CheckStatus.NotChecked;
        }
        if (this.props.treeDataSource.SelectedNodes[data.$meta.nodeId]) {
            return CheckStatus.Checked;
        }
    }

    private _renderExpandCollapseButton(key, rowIndex: number, rowData: AugmentedTreeNode, style, onMouseEnter, isSelectedRow: boolean) {
        const showNodeAsExpanded = rowData.isExpanded || rowData.$meta.descendantSatisfiesFilterCondition;
        let actionsTooltip = showNodeAsExpanded ? 'Collapse' : 'Expand';
        let iconName = showNodeAsExpanded ? 'svg-icon-arrowCollapse' : 'svg-icon-arrowExpand';
        let icon = null;

        const nodeId = rowData.$meta.nodeId;

        if ((!rowData.children || rowData.children.length <= 0) && !rowData.hasChildren) {
            icon = (<div style={{ height: '16px', width: '26px' }}></div>);
            actionsTooltip = null;
        } else {
            icon = (
                <Icon
                    iconName={iconName}
                    style={{ display: 'inline-block' }}
                    className="expand-collapse-action-icon"
                    onClick={(ev) => { ev.stopPropagation(); this._onTreeExpandToggleClick(ev, rowData); }}
                    title={actionsTooltip}
                />
            );
        }

        const onChange = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (this.props.treeDataSource.SelectedNodes[nodeId]) {
                this.props.treeDataSource.removeSelected(rowData);
            } else {
                this.props.treeDataSource.setSelected(rowData);
            }
        };

        let checkBox: JSX.Element = null;
        if (this.props.isMultiSelectable && !rowData.isNodeDisabled) {
            const checked = this.props.treeDataSource.SelectedNodes.hasOwnProperty(nodeId);
            checkBox = (
                <VirtualizedTreeViewCheckBox
                    checked={this.getCheckStatus(rowData)}
                    onChange={onChange}
                    itemId={nodeId.toString()}
                    text=""
                    style={{ paddingTop: 0, paddingRight: 5 }}
                />
            );
        }

        const elements: Array<JSX.Element> = [icon, checkBox];

        const rowClass = 'grid-row-' + rowIndex;
        const title = actionsTooltip;
        const className = classNames(
            'grid-component-cell',
            'expand-collapse-cell',
            rowClass,
            {
                'is-selected': isSelectedRow && this.props.highlightRowsInMultiSelect && !rowData.isNodeDisabled,
                'is-disabled': rowData.isNodeDisabled
            }

        );

        return (
            <CellElement
                key={key}
                id={key}
                style={style}
                className={className}
                onMouseEnter={onMouseEnter}
                onClickParameter={rowData}
                rowClass={rowClass}
                rowData={rowData}
                rowIndex={rowIndex}
                element={elements}
            />
        );
    }

    private _renderBodyCell(columnIndex: number, key, rowIndex: number, rowData: AugmentedTreeNode, style, onMouseEnter, rowActionsRender, isSelectedRow: boolean) {

        const columns = this.state.columnsToDisplay;
        const notLastIndex = columnIndex < (columns.length - 1);
        const column = columns[columnIndex];
        const dataKey = column.dataMember || column.valueMember;
        const cellData = getObjectValue(rowData, dataKey);
        const rowClass = 'grid-row-' + rowIndex;
        const className = classNames(
            'grid-component-cell',
            rowClass,
            column.cellClassName,
            rowData.className,
            {
                'border-column-cell': notLastIndex,
                'is-selected': isSelectedRow && this.props.highlightRowsInMultiSelect && !rowData.isNodeDisabled,
                'is-disabled': rowData.isNodeDisabled
            });

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

        onCellClick = rowData.$meta.isAsyncLoadingDummyNode || this.props.isMultiSelectable ? undefined : onCellClick;
        if (rowData.$meta.isAsyncLoadingDummyNode && columnIndex === 1) {
            columnElement = (
                <div className="loading-container">
                    <Spinner className="async-loading-spinner" type={SpinnerType.small} />
                    <span className="async-loading-label">Loading...</span>
                </div>
            );
        } else if (column.cellFormatter) {
            columnElement = column.cellFormatter(cellData, rowData);
        } else {
            columnElement = [
                columnIndex === 1 && rowData.iconName ? <span key="cellIcon" style={{ display: 'flex' }} title={rowData.iconTooltipContent}><Icon iconName={rowData.iconName} className={rowData.iconClassName} /></span> : null,
                <div key="cellData" className="grid-component-cell-inner" >
                    {cellData}
                </div>
            ];
            if (!notLastIndex && !rowData.$meta.isAsyncLoadingDummyNode) {
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

    private _onTreeExpandToggleClick = (ev, rowData: AugmentedTreeNode) => {
        // with this call we are telling underlying grid not to scroll on selected position on render update
        this._quickGrid.scrollToRow(undefined);
        // we are breaking immutability here and potential redux stores, but we need the performance
        rowData.isExpanded = !rowData.isExpanded;
        if (rowData.isExpanded
            && (!rowData.children || rowData.children.length === 0)
            && rowData.hasChildren
            && this.props.onLazyLoadChildNodes
            && !rowData.$meta.isLazyChildrenLoadInProgress) {
            rowData.$meta.isLazyChildrenLoadInProgress = true;
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

    private _setSelectedNode = (rowIndex: number, nodeData: AugmentedTreeNode) => {
        if (this.state.selectedNodeId === nodeData.$meta.nodeId) {
            return;
        }
        this.setState({ selectedNodeId: nodeData.$meta.nodeId });
        if (this.props.onSelectedNodeChanged) {
            this.props.onSelectedNodeChanged([this._finalGridRows[rowIndex]]);
        }
    }

    private _setSelectedNodeAndState = (nodeId: number | string) => {
        if (this.state.selectedNodeId === nodeId) {
            return;
        }
        this.setState({ selectedNodeId: nodeId });

        if (this.props.onSelectedNodeChanged) {
            const selectedNode = this.props.treeDataSource.getNodeById(nodeId);
            if (selectedNode) {
                this.props.onSelectedNodeChanged([selectedNode]);
            } else {
                this.props.onSelectedNodeChanged([]);
            }
        }
        const selectedRowIndex = this._finalGridRows.findIndex((element) => element.$meta.nodeId === nodeId);

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
                tooltipsEnabled={true}
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
