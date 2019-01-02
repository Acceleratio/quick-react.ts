import * as _ from 'lodash';
import { createSelector } from 'reselect';

import { sortRowsByColumn } from '../../utilities/array';
import {
    DataTypeEnum,
    GridColumn,
    IGroupBy,
    IQuickGridProps,
    IQuickGridState,
    lowercasedColumnPrefix,
    SortDirection,
    FiltersData
} from './QuickGrid.Props';
import { groupRows } from './rowGrouper';
import { resolveCellValueForDisplay } from '../../utilities/resolveCellValue';

const getInputRows = (state: IQuickGridState, props: IQuickGridProps) => props.rows;
const getGroupBy = (state: IQuickGridState, props: IQuickGridProps) => state.groupBy;
const getCollapsedRows = (state: IQuickGridState, props: IQuickGridProps) => state.collapsedRows;
const getSortColumn = (state: IQuickGridState, props: IQuickGridProps) => state.sortColumn;
const getSortDirection = (state: IQuickGridState, props: IQuickGridProps) => state.sortDirection;
const getColumns = (state: IQuickGridState, props: IQuickGridProps) => props.columns;
const getFilterString = (state: IQuickGridState, props: IQuickGridProps) => props.filterString;
const getColumnFilters = (state: IQuickGridState, props: IQuickGridProps) => state.columnFilters;

const getActionItems = (props: IQuickGridProps) => props.gridActions.actionItems;

export const getActionItemOptions = createSelector(getActionItems, (actionItems) => {
    return actionItems.map((item, index) => ({ key: index, icon: item.iconName, text: item.name }));
});

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
    if (groupedColumn && groupedColumn.length > 0) {
        let sortOptions = [];
        for (let groupColumn of groupedColumn) {
            const sortColumn = _.find(columns, column => column.valueMember === groupColumn.column);
            const groupSortModifier = groupColumn.sortDirection === SortDirection.Descending ? -1 : 1;
            const sortFunction = getSortFunctionForColumn(sortColumn, groupColumn.sortDirection);
            sortOptions.push({ sortModifier: groupSortModifier, column: sortColumn, sortFunction: sortFunction });
        }
        if (sortColumnName) {
            const sortColumn = _.find(columns, column => column.valueMember === sortColumnName);
            sortOptions.push({ sortModifier: sortModifier, column: sortColumn, sortFunction: sortColumn.sortByValueGetter });
        }
        return sortRowsByColumn(rows, sortOptions);
    } else if (sortColumnName) {
        const sortColumn = _.find(columns, column => column.valueMember === sortColumnName);
        const sortFunction = getSortFunctionForColumn(sortColumn, sortDirection);
        return sortRowsByColumn(rows, [{ sortModifier: sortModifier, column: sortColumn, sortFunction: sortFunction }]);
    }
    return rows;
};

const filterRows = (rows: Array<any>, columns: Array<GridColumn>, searchText: string, columnFilters: Array<FiltersData>) => {
    if (!searchText) {
        return filterRowsByColumnFilter(rows, columns, columnFilters);
    }
    let filterText = searchText.toLowerCase();
    let members = columns.map(col => col);
    const newRows = rows.filter(row => {
        let visible = false;
        for (let value of members) {
            let result = resolveCellValueForDisplay(row, value);
                if (result != null && result.toString()
                    .toLowerCase().indexOf(filterText) !== -1) {
                    visible = true;
                    break;
                }
            }
        return visible;
    });
    return filterRowsByColumnFilter(newRows, columns, columnFilters);
};


const filterRowsByColumnFilter = (rows: Array<any>, columns: Array<GridColumn>, columnFilters: Array<FiltersData>) => {
    if (columnFilters.length === 0) {
        return rows;
    }

    let members = columns.map(col => col);
    const newRows = rows.filter(row => {
        let visible = true;
        for (let filterData of columnFilters ) {
            const value = members[filterData.columnIndex];
            const result = resolveCellValueForDisplay(row, value);
            const filterValue = filterData.filterValue.toLowerCase();
            if (result != null && result.toString()
                .toLowerCase().indexOf(filterValue) === -1) {
                visible = false;
                break;
            }
        }
        return visible;
    });
    return newRows;
};

const addLowerCaseMembersToRows = (rows: Array<any>, columns: Array<GridColumn>) => {
    let members = columns
        .filter(col => col.dataType === DataTypeEnum.String)
        .map(col => col.valueMember);
    const newRows = [...rows].map(row => {
        let modifiedRow = { ...row };
        for (let value of members) {
            modifiedRow[lowercasedColumnPrefix + value] = modifiedRow[value] ? modifiedRow[value].toLowerCase() : modifiedRow[value];
        }
        return modifiedRow;
    });
    return newRows;
};

const getRowsWithLowerCase = createSelector(getInputRows, getColumns, (rows, columns) => {
    return addLowerCaseMembersToRows(rows, columns);
});

const getFilteredRows = createSelector(getRowsWithLowerCase, getColumns, getFilterString, getColumnFilters,
    (rows, columns, searchText, columnFilters) => {
        return filterRows(rows, columns, searchText, columnFilters);
    }
);

const getSortedRows = createSelector(getFilteredRows, getSortColumn, getSortDirection, getGroupBy, getColumns,
    (rows, sortColumn, sortDirection, groupBy, columns) => {
        return sortRows(rows, sortColumn, sortDirection, groupBy, columns);
    }
);

export const getRowsSelector = createSelector(getSortedRows, getGroupBy, getCollapsedRows, getColumns, getFilterString,
    (rows, groupedColumns, collapsedRows, columns, filterString) => {
        return groupRows(rows, groupedColumns, collapsedRows, columns);
    }
);
