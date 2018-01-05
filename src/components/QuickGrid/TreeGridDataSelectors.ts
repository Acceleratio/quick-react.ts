import { SortDirection,  IQuickGridState, IQuickGridProps, TreeEntry, TreeGridData } from './QuickGrid.Props';
const createSelector = require('reselect').createSelector;



const getSortColumn = (state: IQuickGridState, props: IQuickGridProps) => state.sortColumn;
const getSortDirection = (state: IQuickGridState, props: IQuickGridProps) => state.sortDirection;
const getTreeData = (state: IQuickGridState, props: IQuickGridProps) => props.tree;
const getCollapsedTreeNodes = (state: IQuickGridState, props: IQuickGridProps) => state.collapsedTreeNodes;



const sortData = (treeData: Array<TreeEntry>, sortColumn: string, sortDirection: SortDirection, collapsedTreeNodes: Array<TreeGridData>) => {
    const sortedTree = sortTree(treeData, sortColumn, sortDirection);
    const flattenedData = flatten(sortedTree);
    return flattenedData.filter(row => { return collapsedTreeNodes.indexOf(row) < 0; } );
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
        if (sortColumn === undefined) {
            sortColumn = 'TreeId';
        }
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

export function flatten(tree): Array<TreeGridData> {
    let result = [];      
    for (let leaf of tree) {
        result.push(leaf.gridData);
        if (leaf.leaves && leaf.leaves.length > 0) {
            const leaves = flatten(leaf.leaves);
            result = result.concat(leaves);
        }
    }
    return result;         
}

export const getTreeRowsSelector = createSelector(getTreeData, getSortColumn, getSortDirection, getCollapsedTreeNodes,
    (treeData, sortColumn, sortDirection, collapsedTreeNodes) => {
        return sortData(treeData, sortColumn, sortDirection, collapsedTreeNodes);
    }
);
