import { GridColumn, SortDirection } from '../QuickGrid/QuickGrid.Props';
import { TreeNode, TreeDataSource, IFinalTreeNode } from '../../models/TreeData';

export interface ITreeGridProps {
    treeDataSource: TreeDataSource;
    columns: Array<GridColumn>;
    className?: string;
    onRowDoubleClicked?: (row: any) => void;
    onSelectedRowChanged?: (selectedRowIndex: number) => void;
    onLoadChildNodes?: (node: IFinalTreeNode) => void;
    sortColumn?: string;
    sortDirection?: SortDirection;
    columnSummaries?: any;
}

export interface ITreeGridState {
    selectedRowIndex?: number;
    columnsToDisplay: Array<GridColumn>;
    sortColumn?: string;
    sortDirection?: SortDirection;
    sortRequestId: number;
    structureRequestChangeId: number;
}