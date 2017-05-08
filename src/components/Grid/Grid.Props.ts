import * as React from 'react';

export interface IGridProps<T> {
    rows: Array<T | GroupRow>;
    columns: Array<GridColumn>;
    groupBy: Array<string>;
    gridClassName?: string;
    headerClassName?: string;
    sortColumn?: string;
    sortDirection?: 'ASC' | 'DESC';
    rowHeight: number | ((info: { index: number }) => number); // Number or a function that returns the height of a row given its index
    headerHeight: number;
    overscanRowCount?: number;
    onSelectedRowChanged?: (selectedRowIndex: number) => void;
    onRowDoubleClicked?: (row: T) => void;
}

export interface IGridState {
    sortColumn?: string;
    sortDirection?: 'ASC' | 'DESC';
    expandedRows: any;
    columnWidths: Array<number>;
    selectedRowIndex?: number;
    hoverRowIndex?: number;
}

export interface GroupRow {
    type: 'GroupRow';
    columnGroupName: string;
    name: string;
    depth: number;
    groupKey: string;
    isExpanded: boolean;
}

export interface GridColumn {
    headerText: string;
    valueMember: string; // for sort & grouping
    isSortable?: boolean;
    width: number;
    minWidth?: number;
    dataMember?: string;
    cellFormatter?: (cellData) => any;
    cellClassName?: string;
    headerClassName?: string;
}

