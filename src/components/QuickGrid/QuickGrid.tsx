import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { AutoSizer, Table, Column, ColumnProps, ScrollSync, Grid } from 'react-virtualized';
import {
    IQuickGridProps, IQuickGridState, GridColumn, GroupRow,
    IGroupBy, SortDirection, DataTypeEnum, lowercasedColumnPrefix
} from './QuickGrid.Props';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');
import { getRowsSelector } from './DataSelectors';
import { groupRows } from './rowGrouper';
import { GridHeader } from './QuickGridHeader';
import { Dropdown, DropdownType, IDropdownOption } from '../Dropdown';
import { Icon } from '../Icon/Icon';
import * as _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider, DragDropContext } from 'react-dnd';
import { groupBy as arrayGroupBy } from '../../utilities/array';
const createSelector = require('reselect').createSelector;
import './QuickGrid.scss';

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
        rowHeight: 28
    };
    private _grid: any;
    private _headerGrid: any;
    private parentElement: HTMLElement;
    private columnsMinTotalWidth = 0;
    constructor(props: IQuickGridProps) {
        super(props);
        const hasActionColumn = props.gridActions != null;
        const groupByState = this.getGroupByFromProps(props.groupBy);
        const columnsToDisplay = this.getColumnsToDisplay(props.columns, groupByState, hasActionColumn);
        this.state = {
            columnWidths: this.getColumnWidths(columnsToDisplay),
            columnsToDisplay: columnsToDisplay,
            collapsedRows: [],
            selectedRowIndex: undefined,
            sortColumn: props.sortColumn,
            sortDirection: props.sortDirection,
            groupBy: groupByState,
            rows: this.addLowerCaseMembersToRows(props.rows, props.columns)
        };
        this.columnsMinTotalWidth = columnsToDisplay.map(x => x.minWidth || defaultMinColumnWidth).reduce((a, b) => a + b, 0);
        this.onGridResize = _.debounce(this.onGridResize, 100);
    }

    addLowerCaseMembersToRows = (rows: Array<any>, columns: Array<GridColumn>) => {
        let members = columns.filter(col =>
            (col.dataType === DataTypeEnum.String)).map(col => (col.valueMember));
        const newRows = [...rows].map((row) => {
            let modifiedRow = { ...row };
            for (let value of members) {
                modifiedRow[lowercasedColumnPrefix + value]
                    = modifiedRow[value].toLowerCase();
            }
            return modifiedRow;
        });
        return newRows;
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
        let collapsedRows = this.getAllGroupKeys(this.state.rows);
        this.setState((prevState) => {
            return {
                ...prevState,
                collapsedRows: collapsedRows
            };
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
                minWidth: 15
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
        if (nextProps.columns !== this.props.columns || nextProps.groupBy !== this.props.groupBy) {
            const newGroupBy = this.getGroupByFromProps(nextProps.groupBy);
            const hasActionColumn = nextProps.gridActions != null;
            const columnsToDisplay = this.getColumnsToDisplay(nextProps.columns, newGroupBy, hasActionColumn);
            const columnWidths = this.getColumnWidths(columnsToDisplay);
            this.setState((prevState) => { return { ...prevState, columnsToDisplay: columnsToDisplay, columnWidths: columnWidths, groupBy: newGroupBy }; });
            this.columnsMinTotalWidth = columnsToDisplay.map(x => x.minWidth || defaultMinColumnWidth).reduce((a, b) => a + b, 0);
        }
        if (nextProps.columns !== this.props.columns || nextProps.rows !== this.props.rows) {
            this.setState((oldState) => {
                return {
                    ...oldState,
                    rows: this.addLowerCaseMembersToRows(this.props.rows, this.props.columns)
                };
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.columns !== this.props.columns || prevState.groupBy !== this.state.groupBy || prevState.columnWidths !== this.state.columnWidths) {
            this._grid.recomputeGridSize();
        } else if (this.state.sortDirection !== prevState.sortDirection || this.state.sortColumn !== prevState.sortColumn) {
            this._grid.forceUpdate();
        }
    }

    getGridWidth() {
        let width = 0;
        if (document.getElementsByClassName('viewport-height')[0] !== undefined) {
            width = document.getElementsByClassName('viewport-height')[0].clientWidth;
        } else {
            width = document.getElementById('root').clientWidth;
        }
        // left margin is 25px
        return width - 25 - scrollbarSize();
    }

    getRow = ({ index }) => {
        const rows = this.getRows();
        return rows[index % rows.length];
    }

    getRows() {
        return getRowsSelector(this.state, this.props);
    }

    getRowCount = () => {
        return this.getRows().length;
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
        const rowData = this.getRow({ index: rowIndex });
        if (rowData.type === 'GroupRow' && this.props.groupBy.length > 0) {
            return this.renderGroupCell(columnIndex, key, rowIndex, rowData, style);
        } else {
            if (columnIndex === 0 && this.props.gridActions != null) {
                return this.renderActionCell(key, rowIndex, rowData, style);
            }
            if (columnIndex < this.props.groupBy.length) {
                return this.renderEmptyCell(key, rowIndex, rowData, style);
            }
            return this.renderBodyCell(columnIndex, key, rowIndex, rowData, style);
        }
    }

    renderEmptyCell(key, rowIndex, rowData, style) {
        const rowClass = 'grid-row-' + rowIndex;
        const onMouseEnter = () => { this.onMouseEnterCell(rowClass); };
        const onMouseLeave = () => { this.onMouseLeaveCell(rowClass); };
        const onClick = () => { this.setSelectedRowIndex(rowIndex); };

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
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
            />
        );
    }

    renderActionCell(key, rowIndex: number, rowData, style) {
        const rowClass = 'grid-row-' + rowIndex;
        const onMouseEnter = () => { this.onMouseEnterCell(rowClass); };
        const onMouseLeave = () => { this.onMouseLeaveCell(rowClass); };
        const actionOptions = getActionItemOptions(this.props);
        const { onActionSelected, actionIconName, actionItems } = this.props.gridActions;
        const onActionItemClick = (option, index) => {
            if (onActionSelected) {
                const action = actionItems[option.key];
                onActionSelected(action.commandName, action.parameters, rowData);
            }
        };

        return (
            <div
                key={key}
                style={style}
                className={'grid-component-cell'}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <Dropdown
                    icon={actionIconName}
                    dropdownType={DropdownType.actionDropdown}
                    displaySelection={false}
                    onClick={onActionItemClick}
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
            const divStyle: React.CSSProperties = { paddingLeft: 30 * rowData.depth };
            const toggleRow = () => {
                this.onRowExpandToggle(rowData.groupKey, !rowData.isExpanded);
            };
            let groupByFormat = `${columnName}: ${rowData.displayName}` || `${columnName}: ${rowData.name}`;
            if (this.props.groupRowFormat) {
                groupByFormat = this.props.groupRowFormat(rowData);
            }
            return (
                <div
                    className={'grid-group-row'}
                    key={key}
                    style={customStyle}
                >
                    <div className="grid-group-row-inner" style={divStyle}>
                        <Icon
                            iconName={iconName}
                            onClick={toggleRow} />
                        <div className="group-row-text">
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

    renderBodyCell(columnIndex: number, key, rowIndex: number, rowData, style) {
        const columns = this.state.columnsToDisplay;
        const notLastIndex = columnIndex < (columns.length - 1);
        const column = columns[columnIndex];
        const width = this.state.columnWidths[columnIndex];
        const label = column.headerText;
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
                    <div style={{ padding: '5px 5px 0 5px', fontSize: '14px' }} >
                        {cellData}
                    </div>
                );
            }
        };
        return (
            <div
                key={key}
                style={style}
                className={className}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
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

    onGridResize = () => {
        let columnWidths = this.getColumnWidths(this.state.columnsToDisplay);
        this.setState((prevState) => ({ ...prevState, columnWidths }));
    }

    getColumnWidths(columnsToDisplay) {
        const available = this.getGridWidth();
        if (available > this.columnsMinTotalWidth) {
            const totalWidth = columnsToDisplay.map(x => x.width).reduce((a, b) => a + b, 0);
            return columnsToDisplay.map((col) => this.getColumnWidthInPx(available, totalWidth, col.width));
        } else {
            return columnsToDisplay.map(x => x.minWidth || defaultMinColumnWidth);
        }
    }

    getColumnWidthInPx(available: number, totalWidth: number, currentWidth: number) {
        return Math.floor((available / totalWidth) * currentWidth);
    }

    getColumnWidth = ({ index }) => {
        return this.state.columnWidths[index];
    }

    groupByToolboxHeight = () => {
        return 30 + (this.props.displayGroupContainer ? 62 : 0); // header height + Drag&Drop height+padding
    }
    setHeaderGridReference = (ref) => { this._headerGrid = ref; };
    setGridReference = (ref) => { this._grid = ref; };

    render() {
        let mainClass = classNames('grid-component-container', this.props.gridClassName);
        let headerClass = classNames('grid-component-header', this.props.headerClassName);
        return (
            <div className={mainClass}>

                <ScrollSync>
                    {({ onScroll, scrollLeft }) => (
                        <AutoSizer onResize={this.onGridResize}>
                            {({ height, width }) => (
                                <div style={{ width, height }} >
                                    <GridHeader
                                        ref={this.setHeaderGridReference}
                                        allColumns={this.props.columns}
                                        headerColumns={this.state.columnsToDisplay}
                                        columnWidths={this.state.columnWidths}
                                        onResize={this.onGridHeaderColumnsResize}
                                        sortColumn={this.state.sortColumn}
                                        sortDirection={this.state.sortDirection}
                                        onSort={this.onSortColumn}
                                        width={width - scrollbarSize()}
                                        scrollLeft={scrollLeft}
                                        className={headerClass}
                                        groupBy={this.state.groupBy}
                                        onGroupByChanged={this.props.onGroupByChanged}
                                        displayGroupContainer={this.props.displayGroupContainer}
                                        onGroupBySort={this.onGroupBySort}
                                        hasActionColumn={this.props.gridActions != null}
                                        onCollapseAll={this.collapseAll}
                                        onExpandAll={this.expandAll}
                                    />

                                    <Grid
                                        ref={this.setGridReference}
                                        height={height - this.groupByToolboxHeight()}
                                        width={width}
                                        onScroll={onScroll}
                                        scrollLeft={scrollLeft}
                                        cellRenderer={this.cellRenderer}
                                        overscanRowCount={this.props.overscanRowCount}
                                        columnWidth={this.getColumnWidth}
                                        rowHeight={this.props.rowHeight}
                                        className="grid-component"
                                        rowCount={this.getRowCount()}
                                        columnCount={this.state.columnsToDisplay.length}
                                        {...this.state} // force update on any state change
                                        {...this.props} // force update on any prop change
                                    />
                                </div>
                            )}
                        </AutoSizer>
                    )}
                </ScrollSync>
            </div>
        );
    }
}

export const QuickGrid: React.ComponentClass<IQuickGridProps> = DragDropContext(HTML5Backend)(QuickGridInner);
