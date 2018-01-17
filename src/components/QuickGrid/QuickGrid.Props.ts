import * as React from 'react';

export enum SortDirection {
    Ascending,
    Descending
}

export interface IGroupBy {
    column: string;
    sortDirection: SortDirection;
}

export interface IQuickGridProps {
    rows: Array<any>;
    columns: Array<GridColumn>;
    groupBy?: Array<string | IGroupBy>;
    gridClassName?: string;
    headerClassName?: string;
    rowHeight?: number | ((info: { index: number }) => number); // Number or a function that returns the height of a row given its index
    overscanRowCount?: number;
    onSelectedRowChanged?: (selectedRowIndex: number, rowData: any) => void;
    onRowDoubleClicked?: (row: any) => void;
    displayGroupContainer?: boolean;
    sortColumn?: string;
    sortDirection?: SortDirection;
    onGroupByChanged?: (groupBy: Array<IGroupBy>) => void;
    groupRowFormat?: (rowData: any) => string;
    onGroupBySort?: (sortBy: string, sortDirection: SortDirection) => void;
    gridActions?: QuickGridActions;
    columnSummaries?: any;
    actionsTooltip?: string;
    tooltipsEnabled?: boolean;
    hasCustomRowSelector?: boolean;
    customRowSorter?: (sortBy, sortDirection) => void;
    customCellRenderer?: ({}) => React.ReactNode;
    hasStaticColumns?: boolean;
}

export interface IQuickGridState {
    sortColumn?: string;
    sortDirection?: SortDirection;
    groupBy?: Array<IGroupBy>;
    collapsedRows: Array<string>;
    columnWidths: Array<number>;
    selectedRowIndex?: number;
    columnsToDisplay: Array<GridColumn>;
}

export interface GroupRow {
    type: 'GroupRow';
    columnGroupName: string;
    name: string;
    displayName?: string;
    depth: number;
    groupKey: string;
    isExpanded: boolean;
}

export enum DataTypeEnum {
    Number,
    String,
    Date
}

export interface GridColumn {
    headerText: string;
    valueMember: string; // for sort & grouping
    dataType?: DataTypeEnum;
    isSortable?: boolean; // default true
    isGroupable?: boolean; // default true
    sortByValueGetter?: (cellData, sortDirection: SortDirection) => any;
    width: number;
    minWidth?: number;
    fixedWidth?: boolean;
    dataMember?: string;
    cellFormatter?: (cellData, rowData) => any;
    cellClassName?: string;
    headerClassName?: string;
    headerTooltip?: string;
}

export const lowercasedColumnPrefix = 'lowercase_';

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

