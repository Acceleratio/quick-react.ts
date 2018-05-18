import { GridColumn } from '../QuickGrid';
import { TreeDataSource, AugmentedTreeNode, TreeNode } from '../..';

export interface ICompareResultCell {
    compareResult: number; // represents enum
    compareIcon?: string;
}

export interface ICompareResult extends TreeNode {
    compareResult: ICompareResultCell;
    sourceValue: string;
    targetValue: string;
    displayName: string;
}

export interface ITreeCompareState {
    dataSource: TreeDataSource;
    compareColumns: Array<GridColumn>;
}

export interface ITreeCompareProps {
    columns: Array<GridColumn>;
    rows: Array<ICompareResult> | ICompareResult;
    compareResultRenderer(result: ICompareResultCell): JSX.Element;
}
