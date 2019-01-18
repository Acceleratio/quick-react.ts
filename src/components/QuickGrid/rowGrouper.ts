import * as _ from 'lodash';
import { GroupRow, IGroupBy, GridColumn } from './QuickGrid.Props';
import { groupByColumn as groupByColumnFunction  } from '../../utilities/array';
import { resolveCellValueForDisplay, resolveCellValue } from '../../utilities/resolveCellValue';

class RowGrouper {
    groupByColumns: Array<IGroupBy>;
    columns: Array<GridColumn>;
    collapsedRows: Array<string>;

    constructor(groupByColumns, collapsedRows, columns) {
        this.groupByColumns = [...groupByColumns];
        this.collapsedRows = collapsedRows;
        this.columns = [...columns];
    }

    isRowExpanded(name) {
        let isExpanded = true;
        let index: number = this.collapsedRows.indexOf(name, 0);
        if (index > -1) {
            isExpanded = false;
        }
        return isExpanded;
    }

    groupRowsByColumn(rows, groupByColumnIndex = 0, parentGroupKey = '') {

        let nextColumnIndex = groupByColumnIndex;
        let groupByColumn = this.groupByColumns[groupByColumnIndex];
        let columnName = groupByColumn.column;
        let column = _.find(this.columns, x => x.valueMember === columnName);
        let groupedRows = groupByColumnFunction(rows, column);
        let groupKeys = _.uniq(_.map<any, string>(rows, row => resolveCellValue(row, column)));
        let dataViewRows = [];
        for (let i = 0; i < groupKeys.length; i++) {
            let groupKeyValue = groupKeys[i];
            let groupItem = groupedRows[groupKeyValue][0];
            const groupKey = parentGroupKey + '||' + groupKeyValue;
            let isExpanded = this.isRowExpanded(groupKey);
            const rowGroupHeader: GroupRow = { 
                type: 'GroupRow', 
                columnGroupName: columnName, 
                displayName: resolveCellValueForDisplay(groupItem, column),
                name: groupKeyValue, 
                groupKey: groupKey, 
                depth: groupByColumnIndex, 
                isExpanded: isExpanded 
            };
            dataViewRows.push(rowGroupHeader);
            if (isExpanded) {
                nextColumnIndex = groupByColumnIndex + 1;
                if (this.groupByColumns.length > nextColumnIndex) {
                    dataViewRows = dataViewRows.concat(this.groupRowsByColumn(groupedRows[groupKeyValue], nextColumnIndex, groupKey));
                    nextColumnIndex = groupByColumnIndex - 1;
                } else {
                    dataViewRows = dataViewRows.concat(groupedRows[groupKeyValue]);
                }
            }
        }
        return dataViewRows;
    }
}

export const groupRows = (rows, groupedColumns, expandedRows, columns) => {
    if (!groupedColumns || groupedColumns.length === 0) {
        return rows;
    }
    let rowGrouper = new RowGrouper(groupedColumns, expandedRows, columns);
    return rowGrouper.groupRowsByColumn(rows, 0);
};


