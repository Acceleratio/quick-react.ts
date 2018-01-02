import { SortDirection,  IQuickGridState, IQuickGridProps, TreeEntry } from './QuickGrid.Props';
const createSelector = require('reselect').createSelector;



const getSortColumn = (state: IQuickGridState, props: IQuickGridProps) => state.sortColumn;
const getSortDirection = (state: IQuickGridState, props: IQuickGridProps) => state.sortDirection;
const getTreeData = (state: IQuickGridState, props: IQuickGridProps) => props.tree;

interface TreeEntryGrid extends TreeEntry<{}> {}


const sortData = (treeData: Array<TreeEntryGrid>, sortColumn: string, sortDirection: SortDirection) => {
    const sortedTree = sortTree(treeData, sortColumn, sortDirection);
    const flattenedData = flattenTree(sortedTree);
    return flattenedData;
};

const sortTree = (tree: Array<TreeEntryGrid>, sortColumn: string, sortDirection: SortDirection): Array<TreeEntryGrid> => {
    let newTree: Array<TreeEntryGrid> = [];
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


export const flattenTree = (tree: Array<TreeEntryGrid>) => {
    let result = [];      
    for (let leaf of tree) {
        result.push(leaf.gridData);
        if (leaf.leaves && leaf.leaves.length > 0) {
            const leaves = flattenTree(leaf.leaves);
            result = result.concat(leaves);
        }
    }
    return result;      
};

export const getTreeRowsSelector = createSelector(getTreeData, getSortColumn, getSortDirection,
    (treeData, sortColumn, sortDirection) => {
        return sortData(treeData, sortColumn, sortDirection);
    }
);
