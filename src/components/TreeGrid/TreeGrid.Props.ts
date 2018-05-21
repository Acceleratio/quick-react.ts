import { GridColumn, SortDirection, QuickGridActions } from '../QuickGrid/QuickGrid.Props';
import { TreeNode, TreeDataSource, IFinalTreeNode } from '../../models/TreeData';
import { IDictionary } from '../../utilities/common';

export interface ITreeGridProps {
    treeDataSource: TreeDataSource;
    columns: Array<GridColumn>;

    isMultiSelectable?: boolean;
    className?: string;
    gridActions?: QuickGridActions;
    sortColumn?: string;
    sortDirection?: SortDirection;
    columnSummaries?: any;
    columnHeadersVisible?: boolean;
    filterString?: string;
    selectedNodeId?: number;
    isNodeSelectable?: boolean;

    onRowDoubleClicked?: (row: any) => void;
    onSelectedNodeChanged?: (selectedNode: Array<IFinalTreeNode>) => void;
    onLazyLoadChildNodes?: (node: IFinalTreeNode) => void;
}

export interface ITreeGridState {
    columnsToDisplay: Array<GridColumn>;
    sortColumn?: string;
    sortDirection?: SortDirection;
    sortRequestId: number;
    structureRequestChangeId: number;
    selectedNodeId?: number | string;
}
