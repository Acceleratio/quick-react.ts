import { getObjectValue } from './getObjectValue';
import { resolveCellValue } from './resolveCellValue';
import { GridColumn } from '../components/QuickGrid';

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
    const collator = Intl.Collator([...navigator.languages], {sensitivity: 'accent', numeric: true});
    const sortFunction = (a, b) => {
        for (let sortOption of sortOptions) {
            let valueA;
            let valueB;
            if (sortOption.sortFunction) {
                valueA = sortOption.sortFunction(a);
                valueB = sortOption.sortFunction(b);
            } else {
                valueA = resolveCellValue(a, sortOption.column);
                valueB = resolveCellValue(b, sortOption.column);

            }
            const compare = collator.compare(valueA, valueB);
            if (compare !== 0) {
                return compare * sortOption.sortModifier;
            }
            return 0;
        }
    }
    return [...rows].sort(sortFunction);
};

export const groupByColumn = function (rows, groupColumn) {
    return rows.reduce((groups, item) => {
        let result = resolveCellValue(item, groupColumn);
        (groups[result] = groups[result] || []).push(item);
        return groups;
    }, {});
};