import * as React from 'react';
import { GridColumn, DataTypeEnum, SortDirection } from '../QuickGrid/QuickGrid.Props';

export interface IQuickTreeGridProps {
    rows: Array<any>;
    tree: Array<any>;
    columns: Array<GridColumn>;
    gridClassName?: string;
    headerClassName?: string;
    rowHeight?: number | ((info: { index: number }) => number); // Number or a function that returns the height of a row given its index
    overscanRowCount?: number;
    onSelectedRowChanged?: (selectedRowIndex: number) => void;
    onRowDoubleClicked?: (row: any) => void;
    sortColumn?: string;
    sortDirection?: SortDirection;
    groupRowFormat?: (rowData: any) => string;
    onGroupBySort?: (sortBy: string, sortDirection: SortDirection) => void;
    gridActions?: QuickGridActions;
    columnSummaries?: any;
    tooltipsEnabled?: boolean;
}

export interface IQuickTreeGridState {
    sortColumn?: string;
    sortDirection?: SortDirection;
    collapsedRows: Array<string>;
    columnWidths: Array<number>;
    selectedRowIndex?: number;
    columnsToDisplay: Array<GridColumn>;
}

export interface QuickGridActions {
    actionItems: Array<ActionItem>;
    actionIconName: string;
    onActionSelected: (commandName: string, parameters, rowData) => void;
}

export interface ActionItem {
    name: string;
    commandName: string;
    iconName?: string;
    parameters?: any;
}
