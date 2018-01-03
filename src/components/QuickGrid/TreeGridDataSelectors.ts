import { SortDirection,  IQuickGridState, IQuickGridProps, TreeEntry, GridData } from './QuickGrid.Props';
const createSelector = require('reselect').createSelector;



const getSortColumn = (state: IQuickGridState, props: IQuickGridProps) => state.sortColumn;
const getSortDirection = (state: IQuickGridState, props: IQuickGridProps) => state.sortDirection;
const getTreeData = (state: IQuickGridState, props: IQuickGridProps) => props.tree;
const getCollapsedRows = (state: IQuickGridState, props: IQuickGridProps) => state.collapsedRows;



const sortData = (treeData: Array<TreeEntry>, sortColumn: string, sortDirection: SortDirection, collapsedRows: Array<GridData>) => {
    const sortedTree = sortTree(treeData, sortColumn, sortDirection, collapsedRows);
    const flattenedData = flatten(sortedTree);
    return flattenedData;
};


// ili mozda ovdje provjerit dal je treeEntry u collapsedRows i ako je samo ga maknut?
const sortTree = (tree: Array<TreeEntry>, sortColumn: string, sortDirection: SortDirection, collapsedRows: Array<GridData>): Array<TreeEntry> => {
    let newTree: Array<TreeEntry> = [];
    for (let leaf of tree) {
                  
        leaf.gridData.IsExpanded = collapsedRows.length > 0 ? isRowExpanded(leaf.gridData.TreeId, collapsedRows) : true;
        if (!leaf.gridData.IsExpanded)  {
            continue; 
        }

        if (leaf.leaves && leaf.leaves.length > 0) {
            leaf.leaves = sortTree(leaf.leaves, sortColumn, sortDirection, collapsedRows);
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

const isRowExpanded = (treeId, collapsedRows: Array<GridData>) => {
    let isExpanded: boolean = collapsedRows.find(row => row.TreeId === treeId).IsExpanded; // .indexOf(treeId, 0); // isexpanded je undefined, provjeri dal ga ima ako da vrati ako ne isexpanded je true
    return isExpanded;
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
export const getTreeRowsSelector = createSelector(getTreeData, getSortColumn, getSortDirection, getCollapsedRows,
    (treeData, sortColumn, sortDirection, collapsedRows) => {
        return sortData(treeData, sortColumn, sortDirection, collapsedRows);
    }
);

/*export const getRowsSelector = createSelector(getSortedRows, getGroupBy, getCollapsedRows, getColumns,
    (rows, groupedColumns, collapsedRows, columns) => {
        return groupRows(rows, groupedColumns, collapsedRows, columns);
    }
);*/
