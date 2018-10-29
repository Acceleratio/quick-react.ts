import * as React from 'react';
import * as classNames from 'classnames';
import { IGridHeaderState, IGridHeaderProps } from './QuickGridHeader.Props';
import { GridColumn, SortDirection, getColumnMinWidth } from './QuickGrid.Props';
import { GroupByToolbar } from './GroupByToolbar';
import { HeaderColumn } from './HeaderColumn';
import { Grid, SortIndicator } from 'react-virtualized';
import { shallowCompareArrayEqual } from '../../utilities/array';
const DraggableCore = require('react-draggable').DraggableCore;
import { DragDropContextProvider, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import * as _ from 'lodash';
import './QuickGrid.scss';

export class GridHeaderInner extends React.PureComponent<IGridHeaderProps, IGridHeaderState> {
    public static defaultProps = {
        groupBy: []
    };
    private _headerGrid: any;
    private columnMinWidths: Array<number>;
    private visualWidthChange: number;
    constructor(props: IGridHeaderProps) {
        super(props);
        this.state = {
            columnWidths: props.columnWidths
        };
        this.visualWidthChange = 0;
        this.columnMinWidths = this.getColumnMinWidths(props.headerColumns);
    }

    getColumnMinWidths(columns: Array<GridColumn>) {
        return columns.map((col) => { return getColumnMinWidth(col) || 20; });
    }

    public componentWillReceiveProps(nextProps) {
        if (!shallowCompareArrayEqual(nextProps.columnWidths, this.props.columnWidths)) {
            this.setState((prevState) => { return { ...prevState, columnWidths: nextProps.columnWidths }; });
            this.columnMinWidths = this.getColumnMinWidths(nextProps.headerColumns);
        }
    }

    public componentDidUpdate(prevProps, prevState) {
        this._headerGrid.recomputeGridSize();
    }

    setGridReference = (ref) => { this._headerGrid = ref; };

    public render() {
        const headerClass = classNames('grid-header', this.props.className);
        const { allColumns, headerColumns, width, scrollLeft, tooltipsEnabled, hideGroupExpandButton } = this.props;
        return (
            <div style={{ width }}>
                {
                    this.props.displayGroupContainer &&
                    <GroupByToolbar
                        columns={allColumns}
                        groupBy={this.props.groupBy}
                        onGroupByChanged={this.props.onGroupByChanged}
                        onGroupByRemoved={this.onGroupByRemoved}
                        onSort={this.props.onGroupBySort}
                        onCollapseAll={this.props.onCollapseAll}
                        onExpandAll={this.props.onExpandAll}
                        tooltipsEnabled={tooltipsEnabled}
                        hideGroupExpandButton={hideGroupExpandButton}
                    />
                }
                <Grid
                    ref={this.setGridReference}
                    cellRenderer={this.headerCellRender}
                    className="grid-component-header"
                    columnWidth={this.getHeaderColumnWidth}
                    columnCount={headerColumns.length}
                    height={28}
                    rowHeight={28}
                    rowCount={1}
                    width={width}
                    scrollLeft={scrollLeft}
                    {...this.props} // force update on any prop change
                />
            </div>
        );
    }

    onGroupByRemoved = (groupName) => {
        let newGroupBy = _.filter(this.props.groupBy, (group) => { return group.column !== groupName; });
        this.props.onGroupByChanged(newGroupBy);
    }

    getHeaderColumnWidth = ({ index }) => {

        // 19.9.2018.
        // right now we can't reproduce the behavior that comment below describes
        // the problem it creates now is that in case of horizontal scroll, when scrolled to far right,
        // header columns don't align with grid columns - see here: http://take.ms/S8zNT
        // so I commented out the code, but left it here in case that the behavior described below is repeated

        // this hachish code is beceause of some strange behavior when the horizontal scrollbar actually belongs to the inner grid(that can potentially have a vertical scrollbar)
        // the sizes of the header grid and the inner grid do not align properly and when scrolled to to far right 2 pixels are missing
        // it could be that the actual solution is somewhere in the code below that does the column size recalculation
        // if (index === this.state.columnWidths.length - 1 && this._headerGrid._scrollingContainer.scrollLeft > 2) {
        //     return this.state.columnWidths[index] - 2;
        // }

        return this.state.columnWidths[index];
    }

    headerCellRender = ({ columnIndex, key, rowIndex, style }) => {
        const notLastIndex = columnIndex < (this.state.columnWidths.length - 1);
        const column = this.props.headerColumns[columnIndex];
        const isAction = this.props.hasActionColumn && columnIndex === 0 || (column.valueMember === undefined && column.dataMember === undefined);
        const notEmptyColumns = !isAction && columnIndex >= this.props.groupBy.length;
        const displayResizeHandle = notEmptyColumns;

        return (
            <div
                className={classNames({ 'empty-header-column': !displayResizeHandle }, 'grid-header-column')}
                key={key}
                style={style}>
                {notEmptyColumns &&
                    this.createHeaderColumn(column)
                }
                {displayResizeHandle &&
                    <DraggableCore
                        zIndex={100}
                        axis="x"
                        onStop={(e, data) => this.onDragHeaderStop(e, data, columnIndex)}
                        onDrag={(e, data) => this.onDragHeaderColumn(e, data, columnIndex)}
                        position={{ x: 0, y: 0 }}>
                        <div className="grid-column-draggable">&nbsp;</div>
                    </DraggableCore>
                }
            </div>
        );
    }

    onDragHeaderColumn = (e, data, columnIndex) => {
        const gridWidth = this.props.width;
        const scrollValue = this._headerGrid._scrollingContainer.scrollLeft;
        this.setState((oldState) => {
            const currentColumnWidth = oldState.columnWidths[columnIndex];
            let newColumnWidths = [...oldState.columnWidths];
            let newCurrentColumnWidth = currentColumnWidth + data.deltaX;
            let newColumnsTotalWidth = newColumnWidths.reduce(function (acc, val) { return acc + val; });

            // If grid would contain empty space, resize columns.
            if (gridWidth >= newColumnsTotalWidth) {
                newColumnWidths[columnIndex] = newCurrentColumnWidth;

                // Ignore changes if user is trying to reduce last column.
                if (columnIndex === newColumnWidths.length - 1 && data.deltaX < 0) {
                    newCurrentColumnWidth = currentColumnWidth;
                } else {
                    // Do not resize below minimum.
                    if (newCurrentColumnWidth <= this.columnMinWidths[columnIndex]) {
                        newCurrentColumnWidth = this.columnMinWidths[columnIndex];
                        newColumnWidths[newColumnWidths.length - 1] += (oldState.columnWidths[columnIndex] - newCurrentColumnWidth);
                        data.deltaX = newCurrentColumnWidth - oldState.columnWidths[columnIndex];
                    }

                    // Calculate multiplier by which all columns to the right of the current one will be resized.
                    let remainingColumnWidth = 0;
                    for (let index = columnIndex + 1; index < newColumnWidths.length; index++) {
                        remainingColumnWidth += newColumnWidths[index];
                    }
                    let reductionMultiplier = (remainingColumnWidth - data.deltaX) / remainingColumnWidth;

                    // Resize columns by percentage, but do not resize columns below minimum.
                    let resizeableColumns = [];
                    let extraWidth = 0;
                    let availableWidth = 0;
                    for (let index = columnIndex + 1; index < oldState.columnWidths.length; index++) {
                        let newWidth = parseFloat((oldState.columnWidths[index] * reductionMultiplier).toFixed(2));
                        if (newWidth <= this.columnMinWidths[index]) {
                            extraWidth += parseFloat((this.columnMinWidths[index] - newWidth).toFixed(2));
                            newColumnWidths[index] = this.columnMinWidths[index];
                        } else {
                            resizeableColumns.push({ id: index, width: newWidth, min: this.columnMinWidths[index] });
                            availableWidth += newWidth - this.columnMinWidths[index];
                            newColumnWidths[index] = newWidth;
                        }
                    }
                    newColumnWidths[columnIndex] = newCurrentColumnWidth;

                    // Split leftover resizes that would resize columns below minimum to other columns.
                    if (extraWidth > 0 && availableWidth > extraWidth) {
                        remainingColumnWidth = resizeableColumns.reduce(function (acc, val) { return acc + val.width; }, 0);
                        reductionMultiplier = (remainingColumnWidth - extraWidth) / remainingColumnWidth;

                        resizeableColumns.sort((x, y) => {
                            return x.width - y.width;
                        }).forEach(element => {

                            // Resize columns proportionately.
                            let newWidth = element.id !== resizeableColumns[resizeableColumns.length - 1].id ?
                                parseFloat((newColumnWidths[element.id] * reductionMultiplier).toFixed(2)) :
                                parseFloat((newColumnWidths[element.id] - extraWidth).toFixed(2));

                            if (newWidth < element.min) {
                                newWidth = element.min;
                            }

                            // Recalculate width and multiplier.
                            extraWidth -= parseFloat((newColumnWidths[element.id] - newWidth).toFixed(2));
                            remainingColumnWidth -= element.width;
                            reductionMultiplier = (remainingColumnWidth - extraWidth) / remainingColumnWidth;
                            newColumnWidths[element.id] = newWidth;
                        });

                        newColumnsTotalWidth = newColumnWidths.reduce(function (acc, val) { return acc + val; });
                        if (gridWidth !== newColumnsTotalWidth) {
                            newColumnWidths[newColumnWidths.length - 1] += gridWidth - newColumnsTotalWidth;
                        }
                    }
                    newColumnsTotalWidth = newColumnWidths.reduce(function (acc, val) { return acc + val; });

                    // To ensure columns always fill grid, fixes rounding issues.
                    if (data.deltaX < 0 && gridWidth !== newColumnsTotalWidth) {
                        newColumnWidths[newColumnWidths.length - 1] += gridWidth - newColumnsTotalWidth;
                    }
                }
            } else {

                // Do not resize below minimum.
                if (newCurrentColumnWidth <= this.columnMinWidths[columnIndex]) {
                    newCurrentColumnWidth = this.columnMinWidths[columnIndex];
                }
            }

            newColumnWidths[columnIndex] = newCurrentColumnWidth;
            newColumnsTotalWidth = newColumnWidths.reduce(function (acc, val) { return acc + val; });

            // Special case when user is trying to reduce column size while being scrolled all the way to the right.
            // Expand last column so user can see dragging, but save expand value so it can be removed later since this is only visual change.
            if (columnIndex !== newColumnWidths.length - 1 && data.deltaX < 0 && gridWidth < newColumnsTotalWidth && (scrollValue + gridWidth) >= newColumnsTotalWidth) {
                newColumnWidths[newColumnWidths.length - 1] = newColumnWidths[newColumnWidths.length - 1] - data.deltaX;
                this.visualWidthChange -= data.deltaX;
            }
            return { ...oldState, columnWidths: newColumnWidths };
        });
        this._headerGrid.recomputeGridSize({ columnIndex: columnIndex, rowIndex: 0 });
    }

    onDragHeaderStop = (e, data, columnIndex) => {

        // On stop remove visual expand on last column.
        let snapColumnWidth = this.state.columnWidths.map((x) => x);

        if (this.visualWidthChange > 0) {
            snapColumnWidth[snapColumnWidth.length - 1] -= this.visualWidthChange;
            this.visualWidthChange = 0;

            // In case visual expand caused grid to contain empty space.
            let sumWidth = snapColumnWidth.reduce(function (acc, val) { return acc + val; });
            if (this.props.width > sumWidth) {

                let columnCount = snapColumnWidth.length;
                let totalWidth = 0;
                for (let index = columnIndex + 1; index < snapColumnWidth.length; index++) {
                    totalWidth += snapColumnWidth[index];
                }
                let remainingWidth = (this.props.width - sumWidth);
                let percentage = remainingWidth / totalWidth;

                for (let index = columnIndex + 1; index < snapColumnWidth.length; index++) {
                    let newWidth = snapColumnWidth[index] + parseFloat((snapColumnWidth[index] * percentage).toFixed(2));
                    snapColumnWidth[index] = newWidth;
                }
            }
        }

        this.setState((oldState) => {
            return { ...oldState, columnWidths: snapColumnWidth };
        });
        this.props.onResize(snapColumnWidth);
    }

    createHeaderColumn(column: GridColumn) {
        const { headerText, isSortable, headerClassName, valueMember, headerTooltip } = column;
        const columnClassName = classNames('header-column-content', headerClassName, { 'header-column-sortable': isSortable !== false });
        const showSortIndicator = this.props.sortColumn === valueMember;
        const newSortDirection = this.props.sortColumn !== valueMember || this.props.sortDirection === SortDirection.Descending ? SortDirection.Ascending : SortDirection.Descending;
        const onClick = (event) => {
            if (isSortable !== false && this.props.onSort) {
                this.props.onSort(valueMember, newSortDirection);
            }
        };
        const onKeyDown = (event) => {
            if (isSortable !== false && (event.key === 'Enter' || event.key === ' ')) {
                onClick(event);
            }
        };
        return (
            <HeaderColumn
                valueMember={column.valueMember}
                text={headerText}
                showSortIndicator={showSortIndicator}
                sortDirection={this.props.sortDirection}
                className={columnClassName}
                isGroupable={column.isGroupable}
                onClick={onClick}
                onKeyDown={onKeyDown}
                tooltipsEnabled={this.props.tooltipsEnabled}
                tooltip={headerTooltip}
            />
        );
    }
}

export const GridHeader: React.ComponentClass<IGridHeaderProps> = DragDropContext(HTML5Backend)(GridHeaderInner);
