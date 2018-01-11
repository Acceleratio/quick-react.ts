import { ITreeGridState, ITreeGridProps, TreeNode } from './TreeGrid.Props';
import { SortDirection } from '../QuickGrid/QuickGrid.Props';
const createSelector = require('reselect').createSelector;



const getSortColumn = (state: ITreeGridState, props: ITreeGridProps) => state.sortColumn;
const getSortDirection = (state: ITreeGridState, props: ITreeGridProps) => state.sortDirection;
const getTreeData = (state: ITreeGridState, props: ITreeGridProps) => props.tree;
const getCollapsedTreeNodes = (state: ITreeGridState, props: ITreeGridProps) => state.collapsedTreeNodes;


const sortData = (treeData: Array<TreeNode>, sortColumn: string, sortDirection: SortDirection, collapsedTreeNodes: Array<TreeNode>) => {
    const sortedTree = sortTree(treeData, sortColumn, sortDirection);
    const flattenedData = flatten(sortedTree);
    return flattenedData.filter(row => { return collapsedTreeNodes.indexOf(row) < 0; } );
};

const sortTree = (tree: Array<TreeNode>, sortColumn: string, sortDirection: SortDirection): Array<TreeNode> => {
    let newTree: Array<TreeNode> = [];
    for (let child of tree) {
        if (child.children && child.children.length > 0) {
            child.children = sortTree(child.children, sortColumn, sortDirection);
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
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];
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

export function getNodeLevel(node: TreeNode, tree: Array<TreeNode>): number {
    let level = 0;
    while (node.parentId !== null) {
        level++;
        node = tree.find(parent => parent.treeId === node.parentId);
    }
    return level;
}

export function flatten(tree): Array<TreeNode> {
    let result = [];      
    for (let child of tree) {
        result.push(child);
        if (child.children && child.children.length > 0) {
            const children = flatten(child.children);
            result = result.concat(children);
        }
    }
    return result;         
}

export const getTreeRowsSelector = createSelector(getTreeData, getSortColumn, getSortDirection, getCollapsedTreeNodes,
    (treeData, sortColumn, sortDirection, collapsedTreeNodes) => {
        return sortData(treeData, sortColumn, sortDirection, collapsedTreeNodes);
    }
);
