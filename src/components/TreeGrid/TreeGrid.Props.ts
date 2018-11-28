import { GridColumn, SortDirection, QuickGridActions } from '../QuickGrid/QuickGrid.Props';
import { TreeNode, TreeDataSource, AugmentedTreeNode } from '../../models/TreeData';
import { IDictionary } from '../../utilities/common';

export interface ITreeGridProps {
    treeDataSource: TreeDataSource;
    columns: Array<GridColumn>;

    isMultiSelectable?: boolean;
    /**
     * When multiselect is enabled all selected rows will have highlighted background by default.
     */
    highlightRowsInMultiSelect?: boolean;
    className?: string;
    gridActions?: QuickGridActions;
    sortColumn?: string;
    sortDirection?: SortDirection;
    columnSummaries?: any;
    columnHeadersVisible?: boolean;
    filterString?: string;
    selectedNodeId?: number;
    isNodeSelectable?: boolean;
    tooltipsEnabled?: boolean;
    rowHeight?: number | ((info: { index: number }) => number); // Number or a function that returns the height of a row given its index
    onRowDoubleClicked?: (row: any) => void;
    onSelectedNodeChanged?: (selectedNode: Array<AugmentedTreeNode>) => void;
    onLazyLoadChildNodes?: (node: AugmentedTreeNode) => void;
    onNodeExpand?: (node: AugmentedTreeNode) => void;
}

export interface ITreeGridState {
    columnsToDisplay: Array<GridColumn>;
    sortColumn?: string;
    sortDirection?: SortDirection;
    sortRequestId: number;
    structureRequestChangeId: number;
    selectedNodeId?: number | string;
}
