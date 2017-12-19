import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { AutoSizer, Table, Column, ColumnProps, ScrollSync, Grid } from 'react-virtualized';
import { IQuickTreeGridProps, IQuickTreeGridState } from './QuickTreeGrid.Props';
import { GridColumn, SortDirection, DataTypeEnum } from '../QuickGrid/QuickGrid.Props';
import { GridHeader } from '../QuickGrid/QuickGridHeader';
import { GridFooter } from '../QuickGrid/QuickGridFooter';
 import { getRows } from './TreeGridDataSelectors';
import { Icon } from '../Icon/Icon';
import { groupBy as arrayGroupBy } from '../../utilities/array';
const scrollbarSize = require('dom-helpers/util/scrollbarSize');
const createSelector = require('reselect').createSelector;
import './QuickTreeGrid.scss';

const getActionItems = (props: IQuickTreeGridProps) => props.gridActions.actionItems;
const getActionItemOptions = createSelector([getActionItems], (actionItems) => {
    return actionItems.map((item, index) => ({ key: index, icon: item.iconName, text: item.name }));
});

const defaultMinColumnWidth = 50;
const emptyCellWidth = 5;
export class QuickTreeGridInner extends React.Component<IQuickTreeGridProps, IQuickTreeGridState> {
    public static defaultProps = {
        overscanRowCount: 20,
        groupBy: [],
        rowHeight: 28,
        tooltipsEnabled: true,
        actionsTooltip: 'Actions'
    };
    private finalGridRows: Array<any>;
    private _grid: any;
    private _headerGrid: any;
    private parentElement: HTMLElement;
    private columnsMinTotalWidth = 0;
    constructor(props: IQuickTreeGridProps) {
        super(props);
        const hasActionColumn = props.gridActions != null;
        const columnsToDisplay = this.getColumnsToDisplay(props.columns, hasActionColumn);
        this.state = {
            columnWidths: this.getColumnWidths(columnsToDisplay),
            columnsToDisplay: columnsToDisplay,
            collapsedRows: [],
            selectedRowIndex: undefined,
            sortColumn: props.sortColumn,
            sortDirection: props.sortDirection
        };
        this.columnsMinTotalWidth = columnsToDisplay.map(x => x.minWidth || defaultMinColumnWidth).reduce((a, b) => a + b, 0);
        this.onGridResize = _.debounce(this.onGridResize, 100);
        this.finalGridRows = getRows(this.state, props);
    }

    getColumnsToDisplay(columns: Array<GridColumn>, hasActionColumn: boolean) {
        let emptyArray = new Array();
        if (hasActionColumn) {
            emptyArray.push({
                isSortable: false,
                isGroupable: false,
                width: 15,
                minWidth: 28
            });
        }
        columns = emptyArray.concat(columns);
        return columns;
    }

    componentWillReceiveProps(nextProps: IQuickTreeGridProps) {
        if (nextProps.columns !== this.props.columns) {
            const hasActionColumn = nextProps.gridActions != null;
            const columnsToDisplay = this.getColumnsToDisplay(nextProps.columns, hasActionColumn);
            const columnWidths = this.getColumnWidths(columnsToDisplay);
            this.setState((prevState) => { return { ...prevState, columnsToDisplay: columnsToDisplay, columnWidths: columnWidths }; });
            this.columnsMinTotalWidth = columnsToDisplay.map(x => x.minWidth || defaultMinColumnWidth).reduce((a, b) => a + b, 0);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        this.finalGridRows = getRows(nextState, nextProps);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.columns !== this.props.columns || prevState.columnWidths !== this.state.columnWidths) {
            this._grid.recomputeGridSize();
        } else if (this.state.sortDirection !== prevState.sortDirection || this.state.sortColumn !== prevState.sortColumn) {
            this._grid.forceUpdate();
        }
    }

    getViewportWidth() {
        let width = 0;
        if (document.getElementsByClassName('viewport-height')[0] !== undefined) {
            width = document.getElementsByClassName('viewport-height')[0].clientWidth;
        } else {
            width = document.getElementById('root').clientWidth;
        }
        // 35px margins
        return width - 35;
    }

    getGridWidth() {
        return this.getViewportWidth();
    }

    getGridHeight = (height: number) => {
        return height - 30 - this.gridFooterContainerHeight();
    }

    onGridHeaderColumnsResize = (newColumnWidths: Array<number>) => {
        this.setState((oldState) => ({ ...oldState, columnWidths: newColumnWidths }));
    }

    onSortColumn = (sortBy, sortDirection) => {
        this.setState((oldState) => ({ ...oldState, sortColumn: sortBy, sortDirection: sortDirection }));
    }

    cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const rowData = this.finalGridRows[rowIndex];        
        const rowID: string = !rowData.Test ? '' : rowData.Test;
        const indentSize = 20;
        let indent = 0;
        let level = 0;
        if (rowID.length > 0)  {
            level = rowID.split('.').length;
        }
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
            return this.rednerHiddenCell(key, columnIndex, rowID);     
        }
        if (columnIndex === 2 && shouldIndent) {
                style.width -= indent;            
        }      
        if (shouldIndent) {
            style.left += indent;  
        }
        if (columnIndex === 0 && this.props.gridActions != null) {
            if (rowID.endsWith('*')) {
                return this.renderEmptyCell(key, rowIndex, rowData, style);
            }
            return this.renderActionCell(key, rowID, rowIndex, rowData, style);
        }
        return this.renderBodyCell(columnIndex, key, rowIndex, rowData, style);        
    }

    rednerHiddenCell(key, columnIndex, rowData) {
        const style = {
            display: 'none'
        };
        return (
        <div key={key} style={style}> 
            {rowData}
        </div>);
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

    onActionItemClick = (shouldExpand, name) => {return () => {
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
        };
    }

    renderActionCell(key, name, rowIndex: number, rowData, style) {
        let { tooltipsEnabled } = this.props;
        const iconName = rowData.isExpanded ? 'icon-arrow_down_right' : 'icon-arrow_right';
        const rowClass = 'grid-row-' + rowIndex;
        const onMouseEnter = () => { this.onMouseEnterCell(rowClass); };
        const onMouseLeave = () => { this.onMouseLeaveCell(rowClass); };
        const actionsTooltip = rowData.isExpanded ? 'Collapse' : 'Expand';
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
                onMouseLeave={onMouseLeave}
                title={title}
                onClick={this.onActionItemClick(false, '||' + 'C')}
            >
                <Icon iconName={iconName} className="expand-colapse-action-icon" />
            </div>
        );
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
        const title = this.props.tooltipsEnabled ? cellData : null;
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

    setHeaderGridReference = (ref) => { this._headerGrid = ref; };
    setGridReference = (ref) => { this._grid = ref; };

    render() {
        let mainClass = classNames('grid-component-container', this.props.gridClassName);
        let headerClass = classNames('grid-component-header', this.props.headerClassName);
        return (
            <div className={mainClass}>
                <AutoSizer onResize={this.onGridResize}>
                    {({ height, width }) => (
                        <ScrollSync>
                            {({ onScroll, scrollLeft }) => (
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
                                        width={width}
                                        scrollLeft={scrollLeft}
                                        className={headerClass}
                                        displayGroupContainer={false}
                                        hasActionColumn={this.props.gridActions != null}
                                        tooltipsEnabled={this.props.tooltipsEnabled}
                                    />

                                    <Grid
                                        ref={this.setGridReference}
                                        height={this.getGridHeight(height)}
                                        width={width}
                                        onScroll={onScroll}
                                        scrollLeft={scrollLeft}
                                        cellRenderer={this.cellRenderer}
                                        overscanRowCount={this.props.overscanRowCount}
                                        columnWidth={this.getColumnWidth}
                                        rowHeight={this.props.rowHeight}
                                        className={classNames('grid-component',
                                            { 'no-scrollbar': this.props.columnSummaries })}
                                        rowCount={this.finalGridRows.length}
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

export const QuickTreeGrid: React.ComponentClass<IQuickTreeGridProps> = QuickTreeGridInner;
