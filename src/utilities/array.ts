import { resolveCellValue } from './resolveCellValue';
import * as _ from 'lodash';

export function findIndex<T>(array: Array<T>, predicate: (item: T, index?: number) => boolean): number {
    let index = -1;
    for (let i = 0; array && i < array.length; i++) {
        if (predicate(array[i], i)) {
            index = i;
            break;
        }
    }
    return index;
}

export function shallowCompareArrayEqual(first: Array<any>, second: Array<any>) {
    if (first.length !== second.length) {
        return false;
    }
    for (let index = 0; index < first.length; index++) {
        if (first[index] !== second[index]) {
            return false;
        }
    }
    return true;
}


export interface SortProps {
    column: any;
    sortModifier: 1 | -1;
    sortFunction?: (row) => any;
}

 export const sortRowsByColumn = (rows: Array<any>, sortOptions: Array<SortProps>) => {
     const iteratees = sortOptions.map(sortOption => row => {
         let value;
         if (sortOption.sortFunction) {
             value = sortOption.sortFunction(row);
         } else {
             value = resolveCellValue(row, sortOption.column);
         }
         if (typeof value === 'string') {
             value = value.toLocaleLowerCase();
         }
         return value;
     });
     const orders = sortOptions.map(sortOption => sortOption.sortModifier > 0 ? 'asc' : 'desc');
     return _.orderBy(rows, iteratees, orders);
 };

export const groupByColumn = function (rows, groupColumn) {
    return rows.reduce((groups, item) => {
        let result = resolveCellValue(item, groupColumn);
        (groups[result] = groups[result] || []).push(item);
        return groups;
    }, {});
};
