const createSelector = require('reselect').createSelector;
import {
    IQuickGridState, IQuickGridProps, GridColumn,
    SortDirection, IGroupBy, lowercasedColumnPrefix
} from './QuickGrid.Props';
import { groupRows } from './rowGrouper';
import * as _ from 'lodash';
import { SortProps, sortArray } from '../../utilities/array';
import { DataTypeEnum } from './QuickGrid.Props';

const getInputRows = (state: IQuickGridState, props: IQuickGridProps) => props.rows;
const getGroupBy = (state: IQuickGridState, props: IQuickGridProps) => state.groupBy;
const getCollapsedRows = (state: IQuickGridState, props: IQuickGridProps) => state.collapsedRows;
const getSortColumn = (state: IQuickGridState, props: IQuickGridProps) => state.sortColumn;
const getSortDirection = (state: IQuickGridState, props: IQuickGridProps) => state.sortDirection;
const getColumns = (state: IQuickGridState, props: IQuickGridProps) => props.columns;

const getSortFunctionForColumn = (sortColumn: GridColumn, sortDirection: SortDirection) => {
    if (sortColumn && sortColumn.sortByValueGetter) {
        let sortValueGetter = sortColumn.sortByValueGetter;
        return (row) => sortValueGetter(row, sortDirection); // (row) => return compareValue
    }
    return null;
};

const getColumnName = (sortColumn: GridColumn): string => {
    if (sortColumn.dataType === DataTypeEnum.String) {
        const lowercasedSortingColumn = lowercasedColumnPrefix + sortColumn.valueMember;
        return lowercasedSortingColumn;
    }
    return sortColumn.valueMember;
};

const getColumnNameAndSortFunction = (columns: Array<GridColumn>, sortColumnName: string, sortDirection: SortDirection) => {
    const sortColumn = _.find(columns, column => column.valueMember === sortColumnName);
    const sortFunction = getSortFunctionForColumn(sortColumn, sortDirection);
    const columnName = getColumnName(sortColumn);
    return { sortFunction: sortFunction, columnName: columnName };
};

const sortRows = (rows: Array<any>, sortColumnName: string,
    sortDirection: SortDirection, groupedColumn: Array<IGroupBy>, columns: Array<GridColumn>) => {
    const sortModifier = sortDirection === SortDirection.Descending ? -1 : 1;
    if (groupedColumn.length > 0) {
        let sortOptions = [];
        for (let groupColumn of groupedColumn) {
            const groupSortModifier = groupColumn.sortDirection === SortDirection.Descending ? -1 : 1;
            const { columnName, sortFunction }
                = getColumnNameAndSortFunction(columns, groupColumn.column, groupColumn.sortDirection);
            sortOptions.push({ sortModifier: groupSortModifier, column: columnName, sortFunction: sortFunction });
        }
        if (sortColumnName) {
            const sortColumn = _.find(columns, column => column.valueMember === sortColumnName);
            const columnName = getColumnName(sortColumn);
            sortOptions.push({ sortModifier: sortModifier, column: columnName });
        }
        return sortArray(rows, sortOptions);
    } else if (sortColumnName) {
        const { columnName, sortFunction }
            = getColumnNameAndSortFunction(columns, sortColumnName, sortDirection);
        return sortArray(rows, [{ sortModifier: sortModifier, column: columnName, sortFunction: sortFunction }]);
    }
    return rows;
};

const addLowerCaseMembersToRows = (rows: Array<any>, columns: Array<GridColumn>) => {
    let members = columns
        .filter(col => col.dataType === DataTypeEnum.String)
        .map(col => col.valueMember);
    const newRows = [...rows].map(row => {
        let modifiedRow = { ...row };
        for (let value of members) {
            modifiedRow[lowercasedColumnPrefix + value] = modifiedRow[value].toLowerCase();
        }
        return modifiedRow;
    });
    return newRows;
};

const getRowsWithLowerCase = createSelector(getInputRows, getColumns, (rows, columns) => {
    return addLowerCaseMembersToRows(rows, columns);
});

const getSortedRows = createSelector(getRowsWithLowerCase, getSortColumn, getSortDirection, getGroupBy, getColumns,
    (rows, sortColumn, sortDirection, groupBy, columns) => {
        return sortRows(rows, sortColumn, sortDirection, groupBy, columns);
    });

export const getRowsSelector = createSelector(getSortedRows, getGroupBy, getCollapsedRows, getColumns,
    (rows, groupedColumns, collapsedRows, columns) => {
        return groupRows(rows, groupedColumns, collapsedRows, columns);
    });
