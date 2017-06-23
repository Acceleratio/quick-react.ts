import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { AutoSizer, Table, Column, ColumnProps, ScrollSync, Grid } from 'react-virtualized';
import { IQuickGridProps, IQuickGridState, GridColumn, GroupRow } from './QuickGrid.Props';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');
import { getRowsSelector } from './DataSelectors';
import { groupRows } from './rowGrouper';
import { GridHeader } from './QuickGridHeader';
import { Icon } from '../Icon/Icon';
import * as _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider, DragDropContext } from 'react-dnd';

import './QuickGrid.scss';

const defaultMinWidth = 50;
const emptyCellWidth = 5;
export class QuickGridInner extends React.Component<IQuickGridProps, IQuickGridState> {
    public static defaultProps = {
        overscanRowCount: 20
    };
    private _grid: any;
    private _headerGrid: any;
    private parentElement: HTMLElement;
    private columnsMinTotalWidth = 0;
    constructor(props: IQuickGridProps) {
        super(props);
        let columnsToDisplay = this.getColumnsToDisplay(props.columns, props.groupBy);
        this.state = {
            columnWidths: this.getColumnWidths(columnsToDisplay),
            columnsToDisplay: columnsToDisplay,
            expandedRows: {},
            selectedRowIndex: undefined,
            sortColumn: props.sortColumn,
            sortDirection: props.sortDirection,
            groupBySortColumn: props.groupBySortColumn,
            groupBySortDirection: props.groupBySortDirection
        };
        this.columnsMinTotalWidth = columnsToDisplay.map(x => x.minWidth || defaultMinWidth).reduce((a, b) => a + b, 0);
        this.onResize = _.debounce(this.onResize, 100);
    }

    getColumnsToDisplay(columns, groupBy) {
        let displayColumns = columns.filter((column) => { return groupBy.indexOf(column.valueMember) === -1; });
        let emptyArray = new Array();
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
            const columnsToDisplay = this.getColumnsToDisplay(nextProps.columns, nextProps.groupBy);
            const columnWidths = this.getColumnWidths(columnsToDisplay);
            this.setState((prevState) => { return { ...prevState, columnsToDisplay: columnsToDisplay, columnWidths: columnWidths }; });
            this.columnsMinTotalWidth = columnsToDisplay.map(x => x.minWidth || defaultMinWidth).reduce((a, b) => a + b, 0);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.columns !== this.props.columns || prevProps.groupBy !== this.props.groupBy) {
            this._grid.recomputeGridSize();
        }
    }

    getGridWidth() {
        let width = 0;
        if (document.getElementsByClassName('viewport-height')[0] !== undefined) {
            width = document.getElementsByClassName('viewport-height')[0].clientWidth;
        } else {
            width = document.getElementById('root').clientWidth;
        }
        return width - 40;
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

    onRowExpandToggle(columnGroupName, name, shouldExpand) {
        this.setState((oldState) => {
            let expandedRows = { ...oldState.expandedRows };
            expandedRows[columnGroupName] = { ...expandedRows[columnGroupName] };
            expandedRows[columnGroupName][name] = { isExpanded: shouldExpand };
            return { ...oldState, expandedRows: expandedRows };
        });
    }

    onGridResize = (newColumnWidths: Array<number>) => {
        this.setState((oldState) => {
            return { ...oldState, columnWidths: newColumnWidths };
        });
        this._grid.recomputeGridSize({});
    }

    onSortColumn = (sortBy, sortDirection) => {
        this.setState((oldState) => {
            return { ...oldState, sortColumn: sortBy, sortDirection: sortDirection };
        });
    }

    onGroupBySort = (groupBySortColumn, groupBySortDirection) => {
        this.setState((oldState) => {
            return { ...oldState, groupBySortColumn: groupBySortColumn, groupBySortDirection: groupBySortDirection };
        });
    }

    cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const rowData = this.getRow({ index: rowIndex });
        const columns = this.state.columnsToDisplay;
        const column = columns[columnIndex];
        if (rowData.type === 'GroupRow') {
            return this.renderGroupCell(columnIndex, key, rowIndex, rowData, style);
        } else {
            if (columnIndex < this.props.groupBy.length) {
                return this.renderEmptyCell(key, rowData, rowIndex, style);
            }
            return this.renderBodyCell(columnIndex, key, rowIndex, rowData, style);
        }
    }

    renderEmptyCell(key, rowData, rowIndex, style) {
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

    renderGroupCell(columnIndex: number, key, rowIndex: number, rowData, style) {
        if (columnIndex === 0) {
            const columnsTotalWidth = this.state.columnWidths.reduce((a, b) => a + b, 0);
            const customStyle = { ...style, width: columnsTotalWidth, zIndex: 1 };
            const iconName = rowData.isExpanded ? 'icon-arrow_down_right' : 'icon-arrow_right';
            const columnName = this.props.columns.filter((column) => { return column.valueMember === rowData.columnGroupName; })[0].headerText;
            const spanStyle: React.CSSProperties = { paddingLeft: 30 * rowData.depth, paddingRight: 10, display: 'inline' };
            const toggleRow = () => {
                this.onRowExpandToggle(rowData.columnGroupName, rowData.groupKey, !rowData.isExpanded);
            };
            return (
                <div
                    className={'grid-group-row'}
                    key={key}
                    style={customStyle}
                >
                    <span style={spanStyle}>
                        <Icon
                            iconName={iconName}
                            onClick={toggleRow} />
                        <p style={{ display: 'inline' }}>
                            {columnName}: {rowData.name}
                        </p>
                    </span>
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
                    <div style={{ padding: '5px 5px 0 10px', fontSize: '14px' }} >
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

    onResize = () => {
        let columnWidths = this.getColumnWidths(this.state.columnsToDisplay);
        this.setState((prevState) => { return { ...prevState, columnWidths }; });
        this._grid.recomputeGridSize();
        this._headerGrid._headerGrid.recomputeGridSize();
    }

    getColumnWidths(columnsToDisplay) {
        const available = this.getGridWidth();
        if (available > this.columnsMinTotalWidth) {
            const totalWidth = columnsToDisplay.map(x => x.width).reduce((a, b) => a + b, 0);
            return columnsToDisplay.map((col) => this.getColumnWidthInPx(this.getGridWidth(), totalWidth, col.width));
        } else {
            return columnsToDisplay.map(x => x.minWidth || defaultMinWidth);
        }
    }

    getColumnWidthInPx(available: number, totalWidth: number, currentWidth: number) {
        return Math.floor((available / totalWidth) * currentWidth);
    }

    getColumnWidth = ({ index }) => {
        return this.state.columnWidths[index];
    }

    groupByToolboxHeight = () => {
        return this.props.displayGroupContainer ? 0 : 47;
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
                        <AutoSizer onResize={this.onResize}>
                            {({ height, width }) => (
                                <div style={{ width, height }} >
                                    <GridHeader
                                        ref={this.setHeaderGridReference}
                                        allColumns={this.props.columns}
                                        headerColumns={this.state.columnsToDisplay}
                                        columnWidths={this.state.columnWidths}
                                        onResize={this.onGridResize}
                                        sortColumn={this.state.sortColumn}
                                        sortDirection={this.state.sortDirection}
                                        onSort={this.onSortColumn}
                                        width={width - scrollbarSize()}
                                        scrollLeft={scrollLeft}
                                        className={headerClass}
                                        groupBy={this.props.groupBy}
                                        onGroupByChanged={this.props.onGroupByChanged}
                                        displayGroupContainer={this.props.displayGroupContainer}
                                        groupBySortColumn={this.state.groupBySortColumn}
                                        groupBySortDirection={this.state.groupBySortDirection}
                                        onGroupBySort={this.onGroupBySort}
                                    />
                                    <div style={{ width }} >
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
