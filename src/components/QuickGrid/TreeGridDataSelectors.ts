import { SortDirection,  IQuickGridState, IQuickGridProps, TreeEntry, GridData } from './QuickGrid.Props';
const createSelector = require('reselect').createSelector;



const getSortColumn = (state: IQuickGridState, props: IQuickGridProps) => state.sortColumn;
const getSortDirection = (state: IQuickGridState, props: IQuickGridProps) => state.sortDirection;
const getTreeData = (state: IQuickGridState, props: IQuickGridProps) => props.tree;
const getCollapsedTreeNodes = (state: IQuickGridState, props: IQuickGridProps) => state.collapsedTreeNodes;



const sortData = (treeData: Array<TreeEntry>, sortColumn: string, sortDirection: SortDirection, collapsedTreeNodes: Array<GridData>) => {
    const sortedTree = sortTree(treeData, sortColumn, sortDirection);
    const flattenedData = flatten(sortedTree);
    return flattenedData.filter(row => { return collapsedTreeNodes.indexOf(row) < 0; } );
    // uzmi flattened date i filtriraj one koji se nalaze u collapsed objektu. 
    // leaf.gridData.IsExpanded = collapsedTreeNodes.length > 0 ? isRowExpanded(leaf.gridData.TreeId, collapsedTreeNodes) : true;
    // if (!leaf.gridData.IsExpanded)  {
    //     continue; 
    // }
};


// const isRowExpanded = (name) => {
//     let isExpanded = true;
//     let index: number = this.collapsedRows.indexOf(name, 0);
//     if (index > -1) {
//         isExpanded = false;
//     }
//     return isExpanded;
// };

// const isRowExpanded = (treeId, collapsedTreeNodes: Array<GridData>) => {
//     let isExpanded: boolean = true;
//     let row = collapsedTreeNodes.find(r => r.TreeId === treeId);
//     if (row) {
//         isExpanded = row.IsExpanded;
//     }
//     return isExpanded;
// };


// ili mozda ovdje provjerit dal je treeEntry u collapsedTreeNodes i ako je samo ga maknut?
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


export const flatten = (tree) => {
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

// ovo modificirat kao u dataSelectors sa grupiranjem, te metode mozemo i tu dodat
export const getTreeRowsSelector = createSelector(getTreeData, getSortColumn, getSortDirection, getCollapsedTreeNodes,
    (treeData, sortColumn, sortDirection, collapsedTreeNodes) => {
        return sortData(treeData, sortColumn, sortDirection, collapsedTreeNodes);
    }
);

/*export const getRowsSelector = createSelector(getSortedRows, getGroupBy, getCollapsedRows, getColumns,
    (rows, groupedColumns, collapsedRows, columns) => {
        return groupRows(rows, groupedColumns, collapsedRows, columns);
    }
);*/
