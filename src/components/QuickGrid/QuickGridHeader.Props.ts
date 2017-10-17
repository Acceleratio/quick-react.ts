import { GridColumn, SortDirection, IGroupBy } from './QuickGrid.Props';

export interface IGridHeaderProps {
    allColumns: Array<GridColumn>;
    headerColumns: Array<GridColumn>;
    groupBy: Array<IGroupBy>; 
    columnWidths: Array<number>;
    onResize: (newColumnWidths) => void;
    sortColumn?: string;
    sortDirection?: SortDirection;
    onSort: (sortBy: string, sortDirection: SortDirection) => void;
    onGroupBySort?: (sortBy: string, sortDirection: SortDirection) => void;
    className?: string;
    width: number;
    scrollLeft: any;
    displayGroupContainer: boolean;
    onGroupByChanged?: (groupBy: Array<IGroupBy>) => void;
    hasActionColumn: boolean;
    onCollapseAll: (event) => void;
    onExpandAll: (event) => void;
    tooltipsEnabled?: boolean;
}

export interface IGridHeaderState {
    columnWidths: Array<number>;
}
