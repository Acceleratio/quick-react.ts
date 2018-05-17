import { GridColumn, SortDirection, QuickGridActions } from '../QuickGrid/QuickGrid.Props';
import { TreeNode, TreeDataSource, IExtendedTreeNode } from '../../models/TreeData';

export interface ITreeGridProps {
    treeDataSource: TreeDataSource;
    columns: Array<GridColumn>;
    className?: string;
    onRowDoubleClicked?: (row: any) => void;    
    onSelectedNodeChanged?: (selectedNode: IExtendedTreeNode) => void;
    onLazyLoadChildNodes?: (node: IExtendedTreeNode) => void;
    gridActions?: QuickGridActions;
    sortColumn?: string;
    sortDirection?: SortDirection;
    columnSummaries?: any;
    columnHeadersVisible?: boolean;
    filterString?: string;
    selectedNodeId?: number;
    isNodeSelectable?: boolean;
}

export interface ITreeGridState {    
    columnsToDisplay: Array<GridColumn>;
    sortColumn?: string;
    sortDirection?: SortDirection;
    sortRequestId: number;
    structureRequestChangeId: number;
    selectedNodeId?: number | string;
}
