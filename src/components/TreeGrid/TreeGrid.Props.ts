import { GridColumn, SortDirection, QuickGridActions } from '../QuickGrid/QuickGrid.Props';
import { TreeNode, TreeDataSource, IFinalTreeNode } from '../../models/TreeData';

export interface ITreeGridProps {
    treeDataSource: TreeDataSource;
    columns: Array<GridColumn>;
    className?: string;
    onRowDoubleClicked?: (row: any) => void;    
    onSelectedNodeChanged?: (selectedNode: IFinalTreeNode) => void;
    onLazyLoadChildNodes?: (node: IFinalTreeNode) => void;
    gridActions?: QuickGridActions;
    sortColumn?: string;
    sortDirection?: SortDirection;
    columnSummaries?: any;
    columnHeadersVisible?: boolean;
    filterString?: string;
}

export interface ITreeGridState {    
    columnsToDisplay: Array<GridColumn>;
    sortColumn?: string;
    sortDirection?: SortDirection;
    sortRequestId: number;
    structureRequestChangeId: number;
    selectedNodeId?: number;
}
