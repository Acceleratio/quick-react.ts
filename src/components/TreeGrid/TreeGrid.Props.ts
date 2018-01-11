import { GridColumn, SortDirection } from '../QuickGrid/QuickGrid.Props';

export interface ITreeGridProps {
    tree: Array<TreeNode>;
    columns: Array<GridColumn>;
    className?: string;
    onRowDoubleClicked?: (row: any) => void;
    onSelectedRowChanged?: (selectedRowIndex: number) => void;
    sortColumn?: string;
    sortDirection?: SortDirection;
    columnSummaries?: any;
}

export interface ITreeGridState {
    collapsedTreeNodes: Array<TreeNode>;
    selectedRowIndex?: number;
    columnsToDisplay: Array<GridColumn>;
    sortColumn?: string;
    sortDirection?: SortDirection;
}


export interface TreeNode { // extend this interface on a data structure to be used for row data
    treeId: string;
    parentId: string; // treeId of the parent node
    isExpanded: boolean;
    children: Array<TreeNode>;
}
