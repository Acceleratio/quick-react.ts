import * as React from 'react';
import * as classNames from 'classnames';
import { GridColumn, SortDirection, IGroupBy } from './QuickGrid.Props';
import { shallowCompareArrayEqual } from '../../utilities/array';
import { Grid } from 'react-virtualized';
import './QuickGrid.scss';

export interface IGridFooterProps {
    columnWidths: Array<number>;
    columns: Array<GridColumn>;
    height: number;
    rowHeight: number;
    width: number;
    rowData: any;
    scrollLeft: any;
    onScroll: any;
}

export interface IGridFooterState {
}

export class GridFooter extends React.PureComponent<IGridFooterProps, IGridFooterState> {
    private _footerGrid: any;
    constructor(props: IGridFooterProps) {
        super(props);
    }

    getColumnWidth = ({ index }) => this.props.columnWidths[index];

    componentDidUpdate(prevProps, prevState) {
        this._footerGrid.recomputeGridSize();
    }

    setGridReference = (ref) => { this._footerGrid = ref; };

    columnSummaryCellRenderer = ({ columnIndex, key, rowIndex, style }): JSX.Element => {
        const columns = this.props.columns;
        const column = columns[columnIndex];
        const dataKey = column.dataMember || column.valueMember;
        const cellData = this.props.rowData[dataKey];
        const className = classNames(
            'grid-component-cell',
            'grid-footer-cell');
        return (
            <div
                key={key}
                style={style}
                className={className}
                title={cellData}
            >
                {cellData}
            </div>
        );
    }

    render() {
        return (
                <Grid
                    ref={this.setGridReference}
                    height={this.props.height}
                    width={this.props.width}
                    rowHeight={this.props.rowHeight}
                    rowCount={1}
                    columnCount={this.props.columns.length}
                    cellRenderer={this.columnSummaryCellRenderer}
                    columnWidth={this.getColumnWidth}
                    className="grid-column-footer"
                    scrollLeft={this.props.scrollLeft}
                    onScroll={this.props.onScroll}
                    {...this.props}
                />
        );
    }
}
