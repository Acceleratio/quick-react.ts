import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { AutoSizer, Table, Column, ColumnProps, ScrollSync, Grid } from 'react-virtualized';
import {
    IQuickGridProps, IQuickGridState, GridColumn, GroupRow,
    IGroupBy, SortDirection, DataTypeEnum, lowercasedColumnPrefix, QuickGridActionsBehaviourEnum, ActionItem, getColumnMinWidth
} from './QuickGrid.Props';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');
import { getRowsSelector } from './DataSelectors';


import { GridHeader } from './QuickGridHeader';
import { Dropdown, DropdownType, IDropdownOption } from '../Dropdown';
import { Icon } from '../Icon/Icon';
import * as _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { groupBy as arrayGroupBy } from '../../utilities/array';
const createSelector = require('reselect').createSelector;
import { GridFooter } from './QuickGridFooter';
import './QuickGrid.scss';
import { QuickGridRowContextActionsHandler } from './QuickGridRowContextActionsHandler';

const getActionItems = (props: IQuickGridProps) => props.gridActions.actionItems;
const getActionItemOptions = createSelector([getActionItems], (actionItems) => {
    return actionItems.map((item, index) => ({ key: index, icon: item.iconName, text: item.name }));
});

const defaultMinColumnWidth = 50;
const emptyCellWidth = 5;
export class QuickGridInner extends React.Component<IQuickGridProps, IQuickGridState> {
    public static defaultProps = {
        overscanRowCount: 20,
        groupBy: [],
        rowHeight: 28,
        tooltipsEnabled: true,
        actionsTooltip: 'Actions',
        columnHeadersVisible: true
    };

    private _finalGridRows: Array<any>;
    private _grid: any;
    private _headerGrid: any;
    private _parentElement: Element;
    private _columnsMinTotalWidth = 0;
    private _rowContextActionsHandler: QuickGridRowContextActionsHandler;

    constructor(props: IQuickGridProps) {
        super(props);
        const groupByState = this.getGroupByFromProps(props.groupBy);
        const columnsToDisplay = props.hasStaticColumns ? props.columns : this.getColumnsToDisplay(props.columns, groupByState, this._shouldRenderActionsColumn(props));
        this.state = {
            columnWidths: this.getColumnWidths(columnsToDisplay),
            columnsToDisplay: columnsToDisplay,
            collapsedRows: [],
            selectedRowIndex: undefined,
            sortColumn: props.sortColumn,
            sortDirection: props.sortDirection,
            groupBy: groupByState,
            hasVerticalScroll: false
        };

        this._columnsMinTotalWidth = columnsToDisplay.map(x => getColumnMinWidth(x) || defaultMinColumnWidth).reduce((a, b) => a + b, 0);
        this.onGridResize = _.debounce(this.onGridResize, 100);
        this._finalGridRows = props.hasCustomRowSelector ? props.rows : getRowsSelector(this.state, props);
    }

    expandAll = (event) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                collapsedRows: []
            };
        });
    }

    collapseAll = (event) => {
        let collapsedRows = this.getAllGroupKeys(this.props.rows);
        this.setState((prevState) => {
            return {
                ...prevState,
                collapsedRows: collapsedRows
            };
        });
    }

    updateColumnWidth = (columnIndex: number, getWidth: (oldWidth: number) => number) => {
        this.setState((oldState) => {
            const newWidth = getWidth(oldState.columnWidths[columnIndex]);
            if (newWidth === oldState.columnWidths[columnIndex]) {
                return oldState;
            }
            let newColumnWidths = [...oldState.columnWidths];
            newColumnWidths[columnIndex] = newWidth;
            return { ...oldState, columnWidths: newColumnWidths };
        });
    }

    getAllGroupKeys(rows, groupByColumnIndex = 0, parentGroupKey = '') {
        let groupByColumn = this.state.groupBy[groupByColumnIndex];
        let columnName = groupByColumn.column;
        let groupedRows = arrayGroupBy(rows, columnName);
        let currentGroupKeys = _.uniq(_.map<any, string>(rows, columnName));
        let groupKeys = new Array<string>();
        for (let i = 0; i < currentGroupKeys.length; i++) {
            let groupKeyValue = currentGroupKeys[i];
            const groupKey = parentGroupKey + '||' + groupKeyValue;
            groupKeys.push(groupKey);
            if (this.state.groupBy.length > groupByColumnIndex + 1) {
                groupKeys = groupKeys.concat(this.getAllGroupKeys(groupedRows[groupKeyValue],
                    groupByColumnIndex + 1, groupKey));
            }
        }
        return groupKeys;
    }

    getGroupByFromProps(groupBy: Array<string | IGroupBy>) {
        let groupByState: Array<IGroupBy> = [];
        for (let column of groupBy) {
            if (typeof column === 'string') {
                groupByState.push({
                    column: column,
                    sortDirection: SortDirection.Ascending
                });
            } else {
                groupByState.push(column);
            }
        }
        return groupByState;
    }

    getColumnsToDisplay(columns: Array<GridColumn>, groupBy: Array<IGroupBy>, hasActionColumn: boolean) {
        const groupByColumnNames = groupBy.map(col => col.column);
        let displayColumns = columns.filter((column) => { return groupByColumnNames.indexOf(column.valueMember) === -1; });
        let emptyArray = new Array();
        if (hasActionColumn) {
            emptyArray.push({
                isSortable: false,
                isGroupable: false,
                width: 15,
                minWidth: 28
            });
        }
        for (let index = 0; index < groupBy.length; index++) {
            emptyArray.push({
                isSortable: false,
                isGroupable: false,
                width: emptyCellWidth,
                minWidth: emptyCellWidth
            });
        }
        displayColumns = emptyArray.concat(displayColumns);
        return displayColumns;
    }

    componentWillReceiveProps(nextProps: IQuickGridProps) {
        if (nextProps.columns !== this.props.columns || nextProps.groupBy !== this.props.groupBy
            || nextProps.gridActions !== this.props.gridActions) {
            const newGroupBy = this.getGroupByFromProps(nextProps.groupBy);
            const hasActionColumn = this._shouldRenderActionsColumn(nextProps);
            const columnsToDisplay = nextProps.hasStaticColumns ? nextProps.columns : this.getColumnsToDisplay(nextProps.columns, newGroupBy, hasActionColumn);
            const columnWidths = this.getColumnWidths(columnsToDisplay);
            this.setState((prevState) => { return { ...prevState, columnsToDisplay: columnsToDisplay, columnWidths: columnWidths, groupBy: newGroupBy }; });
            this._columnsMinTotalWidth = columnsToDisplay.map(x => getColumnMinWidth(x) || defaultMinColumnWidth).reduce((a, b) => a + b, 0);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        this._finalGridRows = nextProps.hasCustomRowSelector ? nextProps.rows : getRowsSelector(nextState, nextProps);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.columns !== this.props.columns
            || prevState.groupBy !== this.state.groupBy
            || prevState.columnWidths !== this.state.columnWidths
            || prevState.hasVerticalScroll !== this.state.hasVerticalScroll) {
            this._grid.recomputeGridSize();
        } else if (this.state.sortDirection !== prevState.sortDirection || this.state.sortColumn !== prevState.sortColumn) {
            this._grid.forceUpdate();
        }
        this._rowContextActionsHandler.clearHoveredElement();
    }

    private _mounted: boolean;
    componentDidMount() {
        // we need to hook up to the actual mouse leave event
        // the react event does not function correctly with our custom rendered hover actions, probably because of the ReactDom.render usage
        let domElement = ReactDOM.findDOMNode(this);
        this._parentElement = domElement;
        domElement.addEventListener('mouseleave', this.nativeMouseLeaveListener);
        this._rowContextActionsHandler.setGridRootElement(domElement);
        this._mounted = true;

        // this will have a consequence of a double render, but we need it here to handle the column sizing correctly
        // the previous implementation relied on a global div with a specific class. This was troublesome for multiple reasons
        // one of them being that you could not have two quickgrid in the same document (different widths)
        this.onGridResizeCore();
    }

    componentWillUnmount() {
        this._mounted = false;
        this._rowContextActionsHandler.clearHoveredElement();
        ReactDOM.findDOMNode(this).removeEventListener('mouseleave', this.nativeMouseLeaveListener);
    }

    private nativeMouseLeaveListener = () => {
        this._rowContextActionsHandler.clearHoveredElement();
    }


    getViewportWidth() {
        let width = 800;
        if (this._parentElement) {
            width = this._parentElement.clientWidth;
        }

        return width;
    }

    getGridWidth() {
        return this.getViewportWidth();
    }

    getGridHeight = (height: number) => {
        return height - this.groupByToolboxHeight()
            - this.gridFooterContainerHeight();
    }

    private _shouldRenderActionsColumn(props: IQuickGridProps): boolean {
        return props.gridActions != null && (props.gridActions.actionsBehaviour === undefined || props.gridActions.actionsBehaviour === QuickGridActionsBehaviourEnum.ShowAsFirstColumn);
    }

    onRowExpandToggle(name, shouldExpand) {
        this.setState((oldState) => {
            let collapsedRows = [...oldState.collapsedRows];
            if (shouldExpand) {
                let index: number = collapsedRows.indexOf(name, 0);
                if (index > -1) {
                    collapsedRows.splice(index, 1);
                }
            } else {
                collapsedRows.push(name);
            }
            return { ...oldState, collapsedRows: collapsedRows };
        });
    }

    onGridHeaderColumnsResize = (newColumnWidths: Array<number>) => {
        this.setState((oldState) => ({ ...oldState, columnWidths: newColumnWidths }));
    }

    onSortColumn = (sortBy, sortDirection) => {
        if (this.props.customRowSorter) {
            this.props.customRowSorter(sortBy, sortDirection);
        }
        this.setState((oldState) => ({ ...oldState, sortColumn: sortBy, sortDirection: sortDirection }));
    }

    onGroupBySort = (groupBySortColumn, groupBySortDirection) => {
        this.setState((oldState) => {
            let newGroupBy: Array<IGroupBy> = [...this.state.groupBy];
            let changedColumn = _.find(newGroupBy, group => group.column === groupBySortColumn);
            changedColumn.sortDirection = groupBySortDirection;
            return { ...oldState, groupBy: newGroupBy };
        });
    }

    cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const rowData = this._finalGridRows[rowIndex];
        const onClick = (e) => {
            // https://github.com/facebook/react/issues/1691 funky bussinese because of multiple mount points in the hover actions            
            // so stopPropagation and preventDefault do not work there, manually checking if row actions were clicked
            if (e.currentTarget !== e.target) {
                const rowActionsContainer = e.currentTarget.getElementsByClassName('hoverable-items-container__btn')[0];
                if (rowActionsContainer && rowActionsContainer.contains(e.target)) {
                    return;
                }
            }

            this.setSelectedRowIndex(rowIndex, rowData);
        };


        let defaultRender = (overridenStyle) => {
            if (rowData.type === 'GroupRow') { // todo Different member - > true
                return this.renderGroupCell(columnIndex, key, rowIndex, rowData, overridenStyle);
            } else {
                if (columnIndex === 0 && this._shouldRenderActionsColumn(this.props)) {
                    return this.renderActionCell(key, rowIndex, rowData, overridenStyle);
                }
                if (columnIndex < this.props.groupBy.length) {
                    return this.renderEmptyCell(key, rowIndex, rowData, overridenStyle);
                }
                return this.renderBodyCell(columnIndex, key, rowIndex, rowData, overridenStyle, onClick);
            }
        };

        if (this.props.customCellRenderer) {
            return this.props.customCellRenderer({
                columnIndex,
                key,
                rowIndex,
                style,
                onMouseEnter: this.onMouseEnterCell,
                onMouseClick: onClick,
                rowActionsRender: this.renderRowContextActions,
                isSelectedRow: rowIndex === this.state.selectedRowIndex
            });
        }

        return defaultRender(style);
    }



    renderEmptyCell(key, rowIndex, rowData, style) {
        const rowClass = 'grid-row-' + rowIndex;
        const onMouseEnter = () => { this.onMouseEnterCell(rowIndex); };
        const onClick = () => { this.setSelectedRowIndex(rowIndex, rowData); };

        const onDoubleClick = () => {
            if (this.props.onRowDoubleClicked) {
                this.props.onRowDoubleClicked(rowData);
            }
        };

        const className = classNames(
            'grid-component-cell',
            'grid-empty-cell',
            rowClass,
            { 'is-selected': rowIndex === this.state.selectedRowIndex });

        return (
            <div
                style={style}
                key={key}
                className={className}
                onMouseEnter={onMouseEnter}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
            />
        );
    }

    onActionItemClick = (option, actionIndex, rowIndex) => {
        const { onActionSelected, actionItems } = this.props.gridActions;
        if (onActionSelected) {
            const action = actionItems[actionIndex];
            const rowData = this._finalGridRows[rowIndex];
            onActionSelected(action.commandName, action.parameters, rowData);
        }
    }

    renderActionCell(key, rowIndex: number, rowData, style) {
        let actionsTooltip = this.props.actionsTooltip;

        const rowClass = 'grid-row-' + rowIndex;
        const onMouseEnter = () => { this.onMouseEnterCell(rowIndex); };
        const actionOptions = getActionItemOptions(this.props);
        const { actionIconName } = this.props.gridActions;
        const title = this.props.tooltipsEnabled ? actionsTooltip : null;
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
                title={title}
            >
                <Dropdown
                    dropdownKey={rowIndex}
                    icon={actionIconName}
                    dropdownType={DropdownType.actionDropdown}
                    displaySelection={false}
                    onClick={this.onActionItemClick}
                    options={actionOptions}
                />
            </div>
        );
    }



    renderGroupCell(columnIndex: number, key, rowIndex: number, rowData: GroupRow, style) {
        if (columnIndex === 0) {
            const columnsTotalWidth = this.state.columnWidths.reduce((a, b) => a + b, 0);
            const customStyle = { ...style, width: columnsTotalWidth, zIndex: 1 };
            const iconName = rowData.isExpanded ? 'icon-arrow_down_right' : 'icon-arrow_right';
            const columnName = this.props.columns.filter((column) => { return column.valueMember === rowData.columnGroupName; })[0].headerText;
            const divStyle: React.CSSProperties = { paddingLeft: 25 * rowData.depth };
            const toggleRow = () => {
                this.onRowExpandToggle(rowData.groupKey, !rowData.isExpanded);
            };
            let groupByFormat = `${columnName}: ${rowData.displayName}` || `${columnName}: ${rowData.name}`;
            if (this.props.groupRowFormat) {
                groupByFormat = this.props.groupRowFormat(rowData);
            }
            return (
                <div
                    className={classNames('grid-group-row is-expanded', { 'is-collapsed': !rowData.isExpanded })}
                    key={key}
                    style={customStyle}
                >
                    <div className="grid-group-row-inner" style={divStyle}>
                        <div className="group-row-text" onClick={toggleRow}>
                            <Icon
                                iconName={iconName} />
                            <span>
                                {groupByFormat}
                            </span>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<div key={key} style={style} className={'grid-group-row'} />);
        }
    }

    onMouseEnterCell = (rowIndex: number) => {
        this._rowContextActionsHandler.markRowAsHovered(rowIndex);
    }

    renderBodyCell(columnIndex: number, key, rowIndex: number, rowData, style, onCellClick) {
        const columns = this.state.columnsToDisplay;
        const notLastIndex = columnIndex < (columns.length - 1);
        const isLastColumn = !notLastIndex;
        const column = columns[columnIndex];
        const dataKey = column.dataMember || column.valueMember;
        const cellData = rowData[dataKey];
        const rowClass = 'grid-row-' + rowIndex;
        const isSelectedRow = rowIndex === this.state.selectedRowIndex;
        const className = classNames(
            'grid-component-cell',
            rowClass,
            column.cellClassName,
            { 'border-column-cell': notLastIndex },
            { 'is-selected': isSelectedRow });

        const onMouseEnter = () => { this.onMouseEnterCell(rowIndex); };

        const onDoubleClick = () => {
            if (this.props.onRowDoubleClicked) {
                this.props.onRowDoubleClicked(rowData);
            }
        };

        const columnElement = () => {
            if (column.cellFormatter) {
                return column.cellFormatter(cellData, rowData);
            } else {
                return (
                    <div className="grid-component-cell-inner" >
                        {cellData}
                    </div>
                );
            }
        };
        const title = this.props.tooltipsEnabled ? cellData : null;
        return (
            <div
                key={key}
                style={style}
                className={className}
                onMouseEnter={onMouseEnter}
                onClick={onCellClick}
                onDoubleClick={onDoubleClick}
                title={title}
            >
                {columnElement()}
                {isLastColumn && this.renderRowContextActions(rowIndex, rowData, isSelectedRow)}
            </div>
        );
    }

    renderRowContextActions = (rowIndex, rowData, isSelectedRow) => {
        let actions: Array<ActionItem> = this.getRowContextActions(rowIndex);
        if (!actions || actions.length === 0) {
            return;
        }

        if (isSelectedRow) {
            return <span key="nonHover" className="hoverable-items-container__btn is-selected">
                {
                    this._rowContextActionsHandler.getRenderedActions(rowIndex)
                }
            </span>;
        } else {
            // this is a hook element where the hovered contex row actions will be rendered                        
            return <span key="hover" className="hoverable-items-container__btn hover-allowed">
            </span>;
        }
    }

    setSelectedRowIndex = (rowIndex: number, rowData: any) => {
        this.setState((prevState) => { return { ...prevState, selectedRowIndex: rowIndex }; });
        if (this.props.onSelectedRowChanged) {
            this.props.onSelectedRowChanged(rowIndex, rowData);
        }
    }

    onGridResize = () => {
        this.onGridResizeCore();
    }

    onGridResizeCore = () => {
        let columnWidths = this.getColumnWidths(this.state.columnsToDisplay);
        this.setState((prevState) => ({ ...prevState, columnWidths }));
    }

    getColumnWidths(columnsToDisplay: Array<GridColumn>) {
        const fixedColumns = columnsToDisplay.filter(x => x.fixedWidth);
        let fixedColumnsTotalWidth = 0;
        if (fixedColumns.length > 0) {
            fixedColumnsTotalWidth = fixedColumns.map(col => col.width).reduce((a, b) => a + b);
        }

        const gridWidth = this.getGridWidth();
        const available = gridWidth - fixedColumnsTotalWidth;
        let newColumnWidths = [];
        if (available > this._columnsMinTotalWidth) {
            const totalWidth = columnsToDisplay.map(x => x.width).reduce((a, b) => a + b, 0) - fixedColumnsTotalWidth;
            newColumnWidths = columnsToDisplay.map((col) => this.getColumnWidthInPx(available, totalWidth, col.width, col.fixedWidth));
        } else {
            newColumnWidths = columnsToDisplay.map(x => getColumnMinWidth(x) || defaultMinColumnWidth);
        }

        const totalNewWidth = newColumnWidths.reduce((a, b) => a + b, 0);
        const empty = gridWidth - totalNewWidth;
        if (empty > 0) {
            newColumnWidths[newColumnWidths.length - 1] = newColumnWidths[newColumnWidths.length - 1] + empty;
        }

        return newColumnWidths;
    }

    getColumnWidthInPx(available: number, totalWidth: number, currentWidth: number, fixedWidth: boolean) {
        if (fixedWidth === true) {
            return currentWidth;
        }
        return Math.floor((available / totalWidth) * currentWidth);
    }

    getColumnWidth = ({ index }) => {
        return this.state.columnWidths[index] - (this.state.hasVerticalScroll && (index === this.state.columnWidths.length - 1) ? scrollbarSize() : 0);
    }

    groupByToolboxHeight = () => {
        if (!this.props.columnHeadersVisible) {
            return 2;
        }
        return 30 + (this.props.displayGroupContainer ? 62 : 0); // header height + Drag&Drop height+padding
    }

    gridFooterContainerHeight = () => {
        if (this.props.columnSummaries) {
            return 40 + (this.horizontalScrollbarExists()
                ? scrollbarSize()
                : 0);
        } else {
            return 0;
        }
    }

    horizontalScrollbarExists() {
        const columnWidths = this.state.columnWidths;
        const viewportWidth = this.getViewportWidth();
        const totalColumnsWidth = columnWidths.reduce((previous, current) => {
            return previous + current;
        }, 0);
        return totalColumnsWidth > viewportWidth;
    }

    getRowContextActions = (rowIndex: number) => {
        if (!this.props.gridActions || this.props.gridActions.actionsBehaviour !== QuickGridActionsBehaviourEnum.ShowOnRowHover) {
            return;
        }
        const actions = this.props.gridActions.onGetSingleRowContextActions && this.props.gridActions.onGetSingleRowContextActions(this._finalGridRows[rowIndex]) || this.props.gridActions.actionItems;
        return actions;
    }

    onRowContextActionClicked = (rowIndex: number, action: ActionItem) => {
        this.props.gridActions.onActionSelected(action.commandName, action.parameters, this._finalGridRows[rowIndex]);
    }

    private _setHeaderGridReference = (ref) => { this._headerGrid = ref; };
    private _setGridReference = (ref) => { this._grid = ref; };
    private _setRowContextActionsHandler = (ref) => { this._rowContextActionsHandler = ref; };
    private _onScrollbarPresenceChange = ({ horizontal, size, vertical }) => {
        this.setState({ hasVerticalScroll: vertical });
    }

    render() {
        let mainClass = classNames('grid-component-container', this.props.gridClassName);
        let headerClass = classNames('grid-component-header', this.props.headerClassName);
        return (
            <div className={mainClass}>
                <div className="hoverActions">
                    <QuickGridRowContextActionsHandler ref={this._setRowContextActionsHandler} onGetRowActions={this.getRowContextActions} onActionClicked={this.onRowContextActionClicked} hideDropdownActionIcons={this.props.gridActions.hideDropdownActionIcons}/>
                </div>
                <AutoSizer onResize={this.onGridResize}>
                    {({ height, width }) => (
                        <ScrollSync>
                            {({ onScroll, scrollLeft }) => (
                                <div style={{ width, height }} >
                                    {
                                        this.props.columnHeadersVisible && <GridHeader
                                            ref={this._setHeaderGridReference}
                                            allColumns={this.props.columns}
                                            headerColumns={this.state.columnsToDisplay}
                                            columnWidths={this.state.columnWidths}
                                            onResize={this.onGridHeaderColumnsResize}
                                            sortColumn={this.state.sortColumn}
                                            sortDirection={this.state.sortDirection}
                                            onSort={this.onSortColumn}
                                            width={width}
                                            scrollLeft={scrollLeft}
                                            className={headerClass}
                                            groupBy={this.state.groupBy}
                                            onGroupByChanged={this.props.onGroupByChanged}
                                            displayGroupContainer={this.props.displayGroupContainer}
                                            onGroupBySort={this.onGroupBySort}
                                            hasActionColumn={this._shouldRenderActionsColumn(this.props)}
                                            onCollapseAll={this.collapseAll}
                                            onExpandAll={this.expandAll}
                                            tooltipsEnabled={this.props.tooltipsEnabled}
                                        />
                                    }

                                    <Grid
                                        ref={this._setGridReference}
                                        height={this.getGridHeight(height)}
                                        width={width}
                                        onScroll={onScroll}
                                        scrollLeft={scrollLeft}
                                        cellRenderer={this.cellRenderer}
                                        onScrollbarPresenceChange={this._onScrollbarPresenceChange}
                                        overscanRowCount={this.props.overscanRowCount}
                                        columnWidth={this.getColumnWidth}
                                        rowHeight={this.props.rowHeight}
                                        className={classNames('grid-component',
                                            { 'no-scrollbar': this.props.columnSummaries })}
                                        rowCount={this._finalGridRows.length}
                                        columnCount={this.state.columnsToDisplay.length}
                                        {...this.state} // force update on any state change
                                        {...this.props} // force update on any prop change
                                    />
                                    {this.props.columnSummaries &&
                                        <GridFooter
                                            height={this.gridFooterContainerHeight()}
                                            columnWidths={this.state.columnWidths}
                                            rowData={this.props.columnSummaries}
                                            width={width}
                                            rowHeight={this.gridFooterContainerHeight() - 2}
                                            columns={this.state.columnsToDisplay}
                                            scrollLeft={scrollLeft}
                                            onScroll={onScroll}
                                            tooltipsEnabled={this.props.tooltipsEnabled}
                                        />
                                    }
                                </div>
                            )}
                        </ScrollSync>
                    )}
                </AutoSizer>
            </div>
        );
    }
}

export const QuickGrid: React.ComponentClass<IQuickGridProps> = QuickGridInner;
