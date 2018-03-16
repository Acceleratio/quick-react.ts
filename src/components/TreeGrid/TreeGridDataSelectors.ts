import { ITreeGridState, ITreeGridProps } from './TreeGrid.Props';
import { SortDirection, GridColumn } from '../QuickGrid/QuickGrid.Props';
import { TreeNode, TreeDataSource, IFinalTreeNode } from '../../models/TreeData';
const createSelector = require('reselect').createSelector;


const getChangeRequestIds = (state: ITreeGridState, props: ITreeGridProps, prevProps: ITreeGridProps) => ({ sortRequestId: state.sortRequestId, structureRequestChangeId: state.structureRequestChangeId });
const getSortColumn = (state: ITreeGridState, props: ITreeGridProps, prevProps: ITreeGridProps) => state.sortColumn;
const getSortDirection = (state: ITreeGridState, props: ITreeGridProps, prevProps: ITreeGridProps) => state.sortDirection;
const getTreeData = (state: ITreeGridState, props: ITreeGridProps, prevProps: ITreeGridProps) => props.treeDataSource;
const getColumnsToDisplay = (state: ITreeGridState, props: ITreeGridProps, prevProps: ITreeGridProps) => state.columnsToDisplay;
const getFilterString = (state: ITreeGridState, props: ITreeGridProps, prevProps: ITreeGridProps) => props.filterString;
const getNewSelectedNodeId = (state: ITreeGridState, props: ITreeGridProps, prevProps: ITreeGridProps) => props.selectedNodeId;
const getOldSelectedNodeId = (state: ITreeGridState, props: ITreeGridProps, prevProps: ITreeGridProps) => {
    if (prevProps) {
        return prevProps.selectedNodeId;
    }

    return -1;
};

function flattenArr(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flattenArr(toFlatten) : toFlatten);
    }, []);
}

const getTreePathsToSelected = (node: IFinalTreeNode) => {
    const array = flattenArr(getTreePathsToSelectedReversed(node));
    const keys = Object.keys(array);
    return array.reduce((dict, val) => {
        dict[val.toString()] = null;
        return dict;
    }, {});

    // return getTreePathsToSelectedReversed(node).reverse();
};

const getTreePathsToSelectedReversed = (node: IFinalTreeNode): Array<number> => {
    // if (!node.hasOwnProperty('nodeId')) {
    //     // dosli smo do roota
    //     return {};
    // }




    if (!node.hasOwnProperty('nodeId')) {
        // dosli smo do roota
        return [];
    } else {
        return [node.nodeId].concat(getTreePathsToSelected(node.parent));
    }
};

function transformData(tree: TreeDataSource,
    sortColumn: string,
    sortDirection: SortDirection,
    sortRequestId: number,
    columns: Array<GridColumn>,
    filterString: string, selectedNodeId: number, oldSelectedNodeId: number) {
    let root = tree.getTreeStructure() as (IFinalTreeNode & { filterString: string });

    const selectedNode = tree.getNodeById(selectedNodeId);
    let treePathToSelectedIds;
    if (selectedNode && selectedNodeId !== oldSelectedNodeId) {
        treePathToSelectedIds = getTreePathsToSelected(selectedNode.parent);
    }

    if (root.children.length === 0) {
        return [];
    }

    if (root.filterString !== filterString) {
        filterNodes(root, filterString, columns.map(x => x.dataMember || x.valueMember));
        root.filterString = filterString;
    }

    // 0 level, the node that contains the root nodes must be expanded for sort to kick in
    root.isExpanded = true;
    sortData(root, sortColumn, sortDirection, sortRequestId);
    let flattenedData: Array<IFinalTreeNode> = [];
    let maxExpandedLevel = flatten(root.children, flattenedData, 0, treePathToSelectedIds);
    return { data: flattenedData, maxExpandedLevel };
}

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

function filterNodes(root: IFinalTreeNode, filterText: string, columns: Array<string>);
function filterNodes(root: IFinalTreeNode, nodeFilterFunc: (node: IFinalTreeNode) => boolean);
function filterNodes(root: IFinalTreeNode, arg: ((node: IFinalTreeNode) => boolean) | string, columns?: Array<string>) {
    let doesSatisfyCondition: (node: IFinalTreeNode) => boolean;
    if (arg instanceof Function) {
        doesSatisfyCondition = arg;
    } else {
        let filterText = arg.toLowerCase();
        doesSatisfyCondition = (node: IFinalTreeNode): boolean => {
            if (!filterText) {
                return true;
            }
            let visible = false;
            for (let column of columns) {
                let value = node[column];
                if (typeof value === 'string' && value.toLowerCase().search(filterText) !== -1) {
                    return true;
                }
            }

            return false;
        };
    }

    let processNode = (node: IFinalTreeNode): boolean => {


        let anyDescendantSatisfies = false;
        if (node.children) {
            for (let child of node.children) {
                anyDescendantSatisfies = processNode(child) || anyDescendantSatisfies;
            }
        }

        if (arg) {
            node.satisfiesFilterCondition = doesSatisfyCondition(node);
            node.descendantSatisfiesFilterCondition = anyDescendantSatisfies;
        } else {
            node.satisfiesFilterCondition = undefined;
            node.descendantSatisfiesFilterCondition = undefined;
        }

        return node.satisfiesFilterCondition || node.descendantSatisfiesFilterCondition;
    };

    processNode(root);
}

export function flatten(tree, resultArray: Array<IFinalTreeNode>, level: number = 0, pathToSelected: any = {}): number {
    level++;
    let maxChildLevel = level;
    for (let child of tree) {

        if (child.satisfiesFilterCondition === false && child.descendantSatisfiesFilterCondition === false) {
            continue;
        }
        let thisChildDepth = child.nodeLevel;
        resultArray.push(child);

        if (pathToSelected.hasOwnProperty(child.nodeId)) {
            child.isExpanded = true;
        }

        if (child.children && child.children.length > 0 && (child.isExpanded || child.descendantSatisfiesFilterCondition)) {
            thisChildDepth = flatten(child.children, resultArray, level, pathToSelected);

        } else if (child.hasChildren && child.isExpanded && (!child.children || child.children.length === 0)) {
            resultArray.push({
                nodeLevel: child.nodeLevel + 1,
                nodeId: -child.nodeId,
                parentId: child.id,
                parent: child,
                children: [],
                isAsyncLoadingDummyNode: true,
                sortRequestId: child.sortRequestId
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
    getNewSelectedNodeId,
    getOldSelectedNodeId,
    (treeData, sortColumn, sortDirection, changeRequestIds, columns, filterString, selectedNodeId, oldSelectedNodeId) => {

        return transformData(treeData, sortColumn, sortDirection, changeRequestIds.sortRequestId, columns, filterString, selectedNodeId, oldSelectedNodeId);
    });
