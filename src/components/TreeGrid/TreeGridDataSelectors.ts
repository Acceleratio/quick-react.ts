import { ITreeGridState, ITreeGridProps, TreeNode } from './TreeGrid.Props';
import { SortDirection } from '../QuickGrid/QuickGrid.Props';
const createSelector = require('reselect').createSelector;

export interface IFinalTreeNode extends TreeNode {
    nodeLevel: number;
}


const getSortColumn = (state: ITreeGridState, props: ITreeGridProps) => state.sortColumn;
const getSortDirection = (state: ITreeGridState, props: ITreeGridProps) => state.sortDirection;
const getTreeData = (state: ITreeGridState, props: ITreeGridProps) => props.tree;
const getCollapsedTreeNodes = (state: ITreeGridState, props: ITreeGridProps) => state.collapsedTreeNodes;


const sortData = (treeData: Array<TreeNode>, sortColumn: string, sortDirection: SortDirection, collapsedTreeNodes: Array<TreeNode>) => {
    const sortedTree = sortTree(treeData, sortColumn, sortDirection);
    let flattenedData: Array<IFinalTreeNode> = [];
    flatten(sortedTree, flattenedData);

    // collapsed tree nodes nam zapravo ne trebaju, koriste se samo za change detekciju zasad. trebalo bi ljepse to rijesiti
    //let dt = flattenedData.filter(row => { return collapsedTreeNodes.indexOf(row) < 0; } );
    return flattenedData;
};

const sortTree = (tree: Array<TreeNode>, sortColumn: string, sortDirection: SortDirection): Array<IFinalTreeNode> => {
    let newTree: Array<IFinalTreeNode> = [];
    for (let child of tree) {
        // no reason to sort children that will not be visible
        if (child.children && child.children.length > 0 && child.isExpanded) {
            child.children = sortTree(child.children, sortColumn, sortDirection);
        }
    }
    newTree = sort(tree, sortDirection, sortColumn);

    return newTree;
};

const sort = (input, sortDirection, sortColumn) => {
    if (sortColumn === undefined || sortDirection === undefined) {
        return [...input];
    }
    const sortModifier = sortDirection === SortDirection.Descending ? -1 : 1;
    const sortFunction = (a, b) => {
        
        let sortColumnFinal = sortColumn;
        let valueA = a[sortColumnFinal];
        let valueB = b[sortColumnFinal];
        if (valueA < valueB) {
            return -1 * sortModifier;
        }
        if (valueA > valueB) {
            return 1 * sortModifier;
        }
        sortColumnFinal = 'treeId';
        valueA = a[sortColumnFinal];
        valueB = b[sortColumnFinal];
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

export function getNodeChildrenRecursively(tree: Array<TreeNode>, id): Array<TreeNode> {
    let result = [];
    for (let child of tree) {
        if (child.parentId === id) {
            result.push(child);
            if (child.children.length > 0) {
                result = result.concat(this.getNodeChildrenRecursively(child.children, child.treeId));
            }
        }
    }
    return result;
}

// export function getNodeLevel(node: TreeNode, tree: Array<TreeNode>): number {
//     let level = 0;
//     while (node.parentId !== null) {
//         level++;
//         node = tree.find(parent => parent.treeId === node.parentId);
//     }
//     return level;
// }

export function flatten(tree, resultArray: Array<TreeNode>, level: number = 0) {    
    level++;
    for (let child of tree) {
        resultArray.push(child);
        child.nodeLevel = level;
        if (child.children && child.children.length > 0 && child.isExpanded) {
            flatten(child.children, resultArray, level);
        }
    }    
}

export const getTreeRowsSelector = createSelector(getTreeData, getSortColumn, getSortDirection, getCollapsedTreeNodes,
    (treeData, sortColumn, sortDirection, collapsedTreeNodes) => {
        return sortData(treeData, sortColumn, sortDirection, collapsedTreeNodes);
    }
);


