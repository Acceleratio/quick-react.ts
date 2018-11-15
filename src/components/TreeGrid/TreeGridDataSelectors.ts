import { ITreeGridState, ITreeGridProps } from './TreeGrid.Props';
import { SortDirection, GridColumn } from '../QuickGrid/QuickGrid.Props';
import { TreeNode, TreeDataSource, AugmentedTreeNode } from '../../models/TreeData';
import * as _ from 'lodash';

const createSelector = require('reselect').createSelector;


const getChangeRequestIds = (state: ITreeGridState, props: ITreeGridProps) => ({ sortRequestId: state.sortRequestId, structureRequestChangeId: state.structureRequestChangeId });
const getSortColumn = (state: ITreeGridState, props: ITreeGridProps) => state.sortColumn;
const getSortDirection = (state: ITreeGridState, props: ITreeGridProps) => state.sortDirection;
const getTreeData = (state: ITreeGridState, props: ITreeGridProps) => props.treeDataSource;
const getColumnsToDisplay = (state: ITreeGridState, props: ITreeGridProps) => state.columnsToDisplay;
const getFilterString = (state: ITreeGridState, props: ITreeGridProps) => props.filterString;

const getNewSelectedNodeId = (state: ITreeGridState, newProps: ITreeGridProps, oldProps: ITreeGridProps) => newProps.selectedNodeId;
const getCurrentlySelectedNodeId = (state: ITreeGridState, newProps: ITreeGridProps, oldProps: ITreeGridProps) => oldProps.selectedNodeId;

const getTreePathsToSelected = (node: AugmentedTreeNode) => {
    if (!node || node.$meta.nodeLevel === -1) {
        // we come to root, go back...
        return {};
    } else {
        const dict = getTreePathsToSelected(node.parentNode);
        const currentIdDict = {};
        currentIdDict[node.$meta.nodeId.toString()] = null;
        return { ...dict, ...currentIdDict };
    }
};

const transformData = (tree: TreeDataSource,
    sortColumn: string,
    sortDirection: SortDirection,
    sortRequestId: number,
    columns: Array<GridColumn>,
    filterString: string,
    currentlySelectedNodeId,
    newSelectedNodeId
) => {
    let root = tree.getTreeStructure() as AugmentedTreeNode & { filterString: string };
    if (root.children.length === 0) {
        return [];
    }

    let idsInPathToSelected = undefined;

    // this is the case when new node is selected,
    // and it could be the case that selected node is somewhere collapsed because
    // this is controlled component with mutable state, so we need to check if newly
    // selected node is collapsed and if it is we need to expand it to first expanded parent
    if (newSelectedNodeId && currentlySelectedNodeId !== newSelectedNodeId) {
        // get ids of all nodes in the path from root to currently selected node
        const currentNode = tree.getNodeById(newSelectedNodeId);
        idsInPathToSelected = getTreePathsToSelected(currentNode.parentNode);
    }

    if (filterString !== undefined && filterString !== null && root.filterString !== filterString) {
        filterNodes(root, filterString, columns.map(x => x.dataMember || x.valueMember));
        root.filterString = filterString;
    }

    // 0 level, the node that contains the root nodes must be expanded for sort to kick in
    root.isExpanded = true;
    sortData(root, sortColumn, sortDirection, sortRequestId, getColumnValueGetter(sortColumn, columns, sortDirection));
    let flattenedData: Array<AugmentedTreeNode> = [];
    let maxExpandedLevel = flatten(root.children, flattenedData, 0, idsInPathToSelected);
    return { data: flattenedData, maxExpandedLevel };
};

const getColumnValueGetter = (sortColumnName: string, columns: Array<GridColumn>, sortDirection: SortDirection) => {
    const sortColumn = _.find(columns, column => column.valueMember === sortColumnName);
    const valueGetterFunc = getValueGetterFunc(sortColumn, sortDirection);
    return valueGetterFunc;
};

const getValueGetterFunc = (sortColumn: GridColumn, sortDirection: SortDirection) => {
    if (sortColumn && sortColumn.sortByValueGetter) {
        let sortValueGetter = sortColumn.sortByValueGetter;
        return (row) => sortValueGetter(row, sortDirection);
    }
    return null;
};

const sortData = (treeNode: AugmentedTreeNode, sortColumn: string, sortDirection: SortDirection, rootSortRequestId: number, valueGetterForSort: (row: any) => any): void => {

    if (!treeNode.children || treeNode.children.length === 0) {
        return;
    }
    // no sense in sorting nodes that are not expanded, performance gains
    if (!treeNode.isExpanded) {
        return;
    }

    for (let child of treeNode.children) {
        sortData(<AugmentedTreeNode>child, sortColumn, sortDirection, rootSortRequestId, valueGetterForSort);
    }

    // if the last sort configuration differs from the current, we need to resort the children
    // otherwise, performance gains
    if ((<AugmentedTreeNode>treeNode).$meta.sortRequestId !== rootSortRequestId) {
        sort(treeNode.children, sortDirection, sortColumn, valueGetterForSort);
        (<AugmentedTreeNode>treeNode).$meta.sortRequestId = rootSortRequestId;
    }
};

const sort = (input, sortDirection, sortColumn, valueGetterForSort) => {
    if (sortColumn === undefined || sortDirection === undefined) {
        return input;
    }
    const sortModifier = sortDirection === SortDirection.Descending ? -1 : 1;
    const sortFunction = (a, b) => {

        let sortColumnFinal = sortColumn;
        let valueA;
        let valueB;
        if (valueGetterForSort) {
            valueA = valueGetterForSort(a);
            valueB = valueGetterForSort(b);
        } else {
            valueA = a[sortColumnFinal];
            valueB = b[sortColumnFinal];
        }
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

function filterNodes(root: AugmentedTreeNode, filterText: string, columns: Array<string>);
function filterNodes(root: AugmentedTreeNode, nodeFilterFunc: (node: AugmentedTreeNode) => boolean);
function filterNodes(root: AugmentedTreeNode, arg: ((node: AugmentedTreeNode) => boolean) | string, columns?: Array<string>) {
    let doesSatisfyCondition: (node: AugmentedTreeNode) => boolean;
    if (arg instanceof Function) {
        doesSatisfyCondition = arg;
    } else {
        let filterText = arg.toLowerCase().trim();
        doesSatisfyCondition = (node: AugmentedTreeNode): boolean => {
            if (!filterText) {
                return true;
            }
            let visible = false;
            for (let column of columns) {
                let value = node[column];
                let typeOfValue = typeof value;

                if (typeOfValue === 'number') {
                    value = value.toString();
                    typeOfValue = 'string';
                }

                if (typeOfValue === 'string' && value.toLowerCase().indexOf(filterText) !== -1) {
                    return true;
                }
            }
            return false;
        };
    }

    let processNode = (node: AugmentedTreeNode): boolean => {


        let anyDescendantSatisfies = false;
        if (node.children) {
            for (let child of node.children) {
                anyDescendantSatisfies = processNode(<AugmentedTreeNode>child) || anyDescendantSatisfies;
            }
        }

        if (arg) {
            node.$meta.satisfiesFilterCondition = doesSatisfyCondition(node);
            node.$meta.descendantSatisfiesFilterCondition = anyDescendantSatisfies;
        } else {
            node.$meta.satisfiesFilterCondition = undefined;
            node.$meta.descendantSatisfiesFilterCondition = undefined;
        }

        return node.$meta.satisfiesFilterCondition || node.$meta.descendantSatisfiesFilterCondition;
    };

    processNode(root);
}

export function flatten(tree: Array<AugmentedTreeNode>, resultArray: Array<AugmentedTreeNode>, level: number = 0, idsInPath): number {
    level++;
    let maxChildLevel = level;
    for (let child of tree) {

        if (child.$meta.satisfiesFilterCondition === false && child.$meta.descendantSatisfiesFilterCondition === false) {
            continue;
        }
        let thisChildDepth = child.$meta.nodeLevel;
        resultArray.push(child);

        if (idsInPath !== undefined && idsInPath.hasOwnProperty(child.$meta.nodeId)) {
            child.isExpanded = true;
        }

        if (child.children && child.children.length > 0 && (child.isExpanded || child.$meta.descendantSatisfiesFilterCondition) && !child.$meta.isLazyChildrenLoadInProgress) {
            thisChildDepth = flatten(child.children, resultArray, level, idsInPath);

        } else if (child.isExpanded && child.$meta.isLazyChildrenLoadInProgress) {
            resultArray.push({
                $meta: {
                    nodeLevel: child.$meta.nodeLevel + 1,
                    nodeId: -child.$meta.nodeId,
                    parentNodeId: child.$meta.nodeId,
                    sortRequestId: child.$meta.sortRequestId,
                    isAsyncLoadingDummyNode: true
                },
                children: [],
                parentNode: child

            });
            thisChildDepth++;
        }
        if (thisChildDepth > maxChildLevel) {
            maxChildLevel = thisChildDepth;
        }
    }

    return Math.max(maxChildLevel, level);
}

export const getTreeRowsSelector = createSelector(getTreeData,
    getSortColumn,
    getSortDirection,
    getChangeRequestIds,
    getColumnsToDisplay,
    getFilterString,
    getCurrentlySelectedNodeId,
    getNewSelectedNodeId,
    (treeData, sortColumn, sortDirection, changeRequestIds, columns, filterString, currentlySelectedNodeId, newSelectedNodeId) => {
        return transformData(treeData, sortColumn, sortDirection, changeRequestIds.sortRequestId, columns, filterString, currentlySelectedNodeId, newSelectedNodeId);
    }
);
