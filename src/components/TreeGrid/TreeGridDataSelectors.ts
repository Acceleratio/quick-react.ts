import { ITreeGridState, ITreeGridProps, TreeNode } from './TreeGrid.Props';
import { SortDirection } from '../QuickGrid/QuickGrid.Props';
const createSelector = require('reselect').createSelector;

export interface IFinalTreeNode extends TreeNode {
    nodeLevel: number;
    sortRequestId: number;
}

const getChangeRequestIds = (state: ITreeGridState, props: ITreeGridProps) => ({ sortRequestId: state.sortRequestId, structureRequestChangeId: state.structureRequestChangeId });
const getSortColumn = (state: ITreeGridState, props: ITreeGridProps) => state.sortColumn;
const getSortDirection = (state: ITreeGridState, props: ITreeGridProps) => state.sortDirection;
const getTreeData = (state: ITreeGridState, props: ITreeGridProps) => props.tree;


const transformData = (tree: TreeNode, sortColumn: string, sortDirection: SortDirection, sortRequestId: number) => {
    if (tree.children.length === 0) {
        return [];
    }
    
    // 0 level, the node that contains the root nodes must be expanded for sort to kick in
    tree.isExpanded = true;
    sortData(tree, sortColumn, sortDirection, sortRequestId);
    let flattenedData: Array<IFinalTreeNode> = [];
    flatten(tree.children, flattenedData);    
    return flattenedData;
};

const sortData = (treeNode: TreeNode, sortColumn: string, sortDirection: SortDirection, rootSortRequestId: number): void => {

    if (!treeNode.children || treeNode.children.length === 0) {
        return;
    }
    // no sense in sorting nodes that are not expanded, performance gains
    if (!treeNode.isExpanded) {
        return;        
    }

    for (let child of treeNode.children) {
        sortData(child, sortColumn, sortDirection, rootSortRequestId);
    }

    // if the last sort configuration differs from the current, we need to resort the children    
    // otherwise, performance gains    
    if ((<IFinalTreeNode>treeNode).sortRequestId !== rootSortRequestId) {        
        sort(treeNode.children, sortDirection, sortColumn);
        (<IFinalTreeNode>treeNode).sortRequestId = rootSortRequestId;
    }    
};

const sort = (input, sortDirection, sortColumn) => {
    if (sortColumn === undefined || sortDirection === undefined) {
        return input;
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
    input.sort(sortFunction);
};

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

export const getTreeRowsSelector = createSelector(getTreeData, getSortColumn, getSortDirection, getChangeRequestIds,
    (treeData, sortColumn, sortDirection, changeRequestIds) => {

        return transformData(treeData, sortColumn, sortDirection, changeRequestIds.sortRequestId);
    }
);
