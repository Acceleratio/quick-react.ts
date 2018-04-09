import { GridColumn } from '../QuickGrid';
import { TreeDataSource, IFinalTreeNode, TreeNode } from '../..';
import { compareResultFactory, CompareResultEnum } from './CompareResultRenderer';

export interface ICompareResultCell {
    compareResult: CompareResultEnum;
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
    rows: Array<ICompareResult>;
}
