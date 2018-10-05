import * as React from 'react';
import * as classNames from 'classnames';
import { FiltersProps} from './QuickGrid.Props';
import { Grid} from 'react-virtualized';
import './QuickGrid.scss';
import { TextField } from '../TextField';
import { ColumnFilter } from './ColumnFilter';

export class AutoFilterRow extends React.PureComponent<FiltersProps, null> {
    private _filtersGrid: any;
    constructor(props: FiltersProps) {
        super(props);
    }

    public componentDidUpdate(prevProps: FiltersProps) {
        if (prevProps.columnWidths !== this.props.columnWidths) {
            this._filtersGrid.recomputeGridSize();
        }
    }

    setGridReference = (ref) => { this._filtersGrid = ref; };

    public render() {
        const { headerColumns, width, scrollLeft} = this.props;
        return (
            <div style={{ width }}>
                <Grid
                    ref={this.setGridReference}
                    cellRenderer={this.filtersCellRender}
                    className="grid-component-header"
                    columnWidth={this.getColumnWidth}
                    columnCount={headerColumns.length}
                    height={28}
                    rowHeight={28}
                    rowCount={1}
                    width={width}
                    scrollLeft={scrollLeft}
                />
            </div>
        );
    }
    
    getColumnWidth = ({ index }) => {

        return this.props.columnWidths[index];
    }

    filtersCellRender = ({ columnIndex, style }) => {
        const column = this.props.headerColumns[columnIndex];
        const text = column.headerText;

        const startColumnIndex = this.props.allColumns.indexOf(this.props.allColumns.find(el => el.headerText === text));

        const filter = this.props.columnFilters.find(el => el.columnIndex === startColumnIndex);
        const filterValue = filter !== undefined ? filter.filterValue : '';

        const isAction = this.props.hasActionColumn && columnIndex === 0 || (column.valueMember === undefined && column.dataMember === undefined);
        const isNotEmpty = !isAction && columnIndex >= this.props.groupBy.length;

        return (
            <div
                className={classNames( 'grid-header-column')}
                style={style}
                key={`column-filter-${text}`}>
                <ColumnFilter
                    columnIndex={startColumnIndex}
                    addColumnFilter={this.props.addColumnFilter}
                    removeColumnFilter={this.props.removeColumnFilter}
                    filterValue={filterValue}
                    isNotEmpty={isNotEmpty}
                />
            </div>
        );
    }
}
