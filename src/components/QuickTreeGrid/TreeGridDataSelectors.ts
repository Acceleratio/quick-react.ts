import { SortDirection } from '../QuickGrid/QuickGrid.Props';
import { IQuickTreeGridState, IQuickTreeGridProps } from './QuickTreeGrid.Props';
const createSelector = require('reselect').createSelector;

export interface TreeEntry {   
    ID: string; 
    leaves: Array<TreeEntry>;
    gridData: any;
    order: number;
}

const flatten = (tree: Array<TreeEntry>) => {
    let result = [];      
    for (let leaf of tree) {
        result.push(leaf.gridData);
        if (leaf.leaves && leaf.leaves.length > 0) {
            const leaves = flatten(leaf.leaves);
            result = result.concat(leaves);
        }
    }
    return result;      
};

const sortData = (treeData: Array<TreeEntry>, sortColumn: string, sortDirection: SortDirection) => {
    const sortedTree = sortTree(treeData, sortColumn, sortDirection);
    const flattenData = flatten(sortedTree);
    return flattenData;
};

const sortTree = (tree: Array<TreeEntry>, sortColumn: string, sortDirection: SortDirection): Array<TreeEntry> => {
    let newTree: Array<TreeEntry> = [];
    for (let leaf of tree) {        
        if (leaf.leaves && leaf.leaves.length > 0) {
            leaf.leaves = sortTree(leaf.leaves, sortColumn, sortDirection);
        }
        newTree = sort([...tree], sortDirection, sortColumn);
    }
    return newTree;
};

const sort = (input, sortDirection, sortColumn) => {
    const sortModifier = sortDirection === SortDirection.Descending ? -1 : 1;
    const sortFunction = (a, b) => {
            let valueA = a.gridData[sortColumn];
            let valueB = b.gridData[sortColumn];
            if (valueA < valueB) {
                return -1 * sortModifier;
            }
            if (valueA > valueB) {
                return 1 * sortModifier;
            }        
        return 0;
    };
    return [...input].sort(sortFunction);
};

const getSortColumn = (state: IQuickTreeGridState, props: IQuickTreeGridProps) => state.sortColumn;
const getSortDirection = (state: IQuickTreeGridState, props: IQuickTreeGridProps) => state.sortDirection;
const getTreeData = (state: IQuickTreeGridState, props: IQuickTreeGridProps) => props.tree;

export const getRows = createSelector(getTreeData, getSortColumn, getSortDirection,
    (treeData, sortColumn, sortDirection) => {
        return sortData(treeData, sortColumn, sortDirection);
    }
);
