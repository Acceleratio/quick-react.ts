import * as React from 'react';
import { ITooltipProps } from '../Tooltip/Tooltip.props';

export interface IQuickGrid {
    scrollToRow(index: number): void;
    updateColumnWidth(columnIndex: number, getWidth: (oldWidth: number) => number): void;
}

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
    customCellRenderer?: (args: ICustomCellRendererArgs) => React.ReactNode;
    hasStaticColumns?: boolean;
    columnHeadersVisible?: boolean;
    isRowSelectable?: boolean;
    delayMs?: number;
    filterString?: string;
}

export interface ICustomCellRendererArgs {
    columnIndex: number;
    key: any;
    rowIndex: number;
    style: any;
    onMouseEnter: any;
    onMouseClick: any;
    isSelectedRow: boolean;
    rowActionsRender: (rowIndex: number, rowData: any, isSelectedRow: boolean) => React.ReactNode;
}

export interface IQuickGridState {
    sortColumn?: string;
    sortDirection?: SortDirection;
    groupBy?: Array<IGroupBy>;
    collapsedRows: Array<string>;
    columnWidths: Array<number>;
    selectedRowIndex?: number;
    columnsToDisplay: Array<GridColumn>;
    hasVerticalScroll: boolean;
    scrolledRow: number;
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
    Date,
    Boolean
}

export enum BoolFormatTypeEnum {
    /**
     * No icons, only text
     */
    TextOnly,
    /**
     * Checkmark for true, nothing for false
     */
    CheckmarkOnly,
    /**
     * Checkmark for true, cross for false
     */
    CheckmarkAndCross
}

export interface GridColumn {
    headerText: string;
    valueMember: string; // for sort & grouping
    dataType?: DataTypeEnum;
    boolFormatType?: BoolFormatTypeEnum;
    isSortable?: boolean; // default true
    isGroupable?: boolean; // default true
    sortByValueGetter?: (cellData, sortDirection: SortDirection) => any;
    width: number;
    minWidth?: number | (() => number);
    fixedWidth?: boolean;
    dataMember?: string;
    cellFormatter?: (cellData, rowData) => any;
    cellClassName?: string;
    headerClassName?: string;
    headerTooltip?: string;
}

export function getColumnMinWidth(col: GridColumn): number {
    if (col.minWidth instanceof Function) {
        return col.minWidth();
    }
    return col.minWidth;
}

export const lowercasedColumnPrefix = 'lowercase_';

export interface QuickGridActions {
    /**
     * the global action items, these will be shown when actionsBehavior equals to ShowAsFirstColumn.
     * If ShowOnRowHover behaviour is used, then they will be shown only if OnGetSingleRowActions does not return a value
     */
    actionItems: Array<ActionItem>;
    /**
     * Determined where the actions will be shown
     */
    actionsBehaviour?: QuickGridActionsBehaviourEnum;
    /**
     * This icon will be used for the dropdown when actionsBehavior equals to ShowAsFirstColumn
     */
    actionIconName: string;
    /**
     * used in ShowOnRowHover behaviur to specify actions per row
     */
    onGetSingleRowContextActions?: (rowData) => Array<ActionItem>;
    onActionSelected: (commandName: string, parameters, rowData) => void;
    hideDropdownActionIcons?: boolean;
}

export enum QuickGridActionsBehaviourEnum {
    ShowAsFirstColumn,
    ShowOnRowHover
}

export interface ActionItem {
    name: string;
    commandName: string;
    iconName?: string;
    parameters?: any;
    tooltip?: ITooltipProps;
}
