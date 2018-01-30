import { ITreeGridState, ITreeGridProps } from './TreeGrid.Props';
import { SortDirection } from '../QuickGrid/QuickGrid.Props';
import { TreeNode, TreeDataSource, IFinalTreeNode } from '../../models/TreeData';
const createSelector = require('reselect').createSelector;


const getChangeRequestIds = (state: ITreeGridState, props: ITreeGridProps) => ({ sortRequestId: state.sortRequestId, structureRequestChangeId: state.structureRequestChangeId });
const getSortColumn = (state: ITreeGridState, props: ITreeGridProps) => state.sortColumn;
const getSortDirection = (state: ITreeGridState, props: ITreeGridProps) => state.sortDirection;
const getTreeData = (state: ITreeGridState, props: ITreeGridProps) => props.treeDataSource;


const transformData = (tree: TreeDataSource , sortColumn: string, sortDirection: SortDirection, sortRequestId: number) => {
    let root = tree.getTreeStructure();
    if (root.children.length === 0) {
        return [];
    }
    
    // 0 level, the node that contains the root nodes must be expanded for sort to kick in
    root.isExpanded = true;
    sortData(root, sortColumn, sortDirection, sortRequestId);
    let flattenedData: Array<IFinalTreeNode> = [];
    flatten(root.children, flattenedData);    
    return flattenedData;
};

const sortData = (treeNode: IFinalTreeNode, sortColumn: string, sortDirection: SortDirection, rootSortRequestId: number): void => {

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

export function flatten(tree, resultArray: Array<IFinalTreeNode>, level: number = 0) {
    level++;
    for (let child of tree) {
        resultArray.push(child);
        if (child.children && child.children.length > 0 && child.isExpanded) {
            flatten(child.children, resultArray, level);
        } else if (child.hasChildren && child.isExpanded && (!child.children || child.children.length === 0)) {
            resultArray.push(<IFinalTreeNode>{
                nodeLevel: child.nodeLevel + 1,
                treeId: child.treeId + '_ASYNC',
                parentId: child.id,
                parent: child,
                children: [],
                isAsyncLoadingDummyNode: true,
                sortRequestId: child.sortRequestId
            });
        }
    }
}

export const getTreeRowsSelector = createSelector(getTreeData, getSortColumn, getSortDirection, getChangeRequestIds,
    (treeData, sortColumn, sortDirection, changeRequestIds) => {

        return transformData(treeData, sortColumn, sortDirection, changeRequestIds.sortRequestId);
    }
);
