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
    // required props
    rows: Array<any>;
    columns: Array<GridColumn>;

    // optional props
    groupBy?: Array<string | IGroupBy>;
    gridClassName?: string;
    headerClassName?: string;
    rowHeight?: number | ((info: { index: number }) => number); // Number or a function that returns the height of a row given its index
    overscanRowCount?: number;
    displayGroupContainer?: boolean;
    sortColumn?: string;
    sortDirection?: SortDirection;
    gridActions?: QuickGridActions;
    columnSummaries?: any;
    actionsTooltip?: string;
    tooltipsEnabled?: boolean;
    hasCustomRowSelector?: boolean;
    hasStaticColumns?: boolean;
    columnHeadersVisible?: boolean;
    isRowSelectable?: boolean;
    delayMs?: number;
    filterString?: string;
    showAutoFilterRow?: boolean;
    hideGroupExpandButton?: boolean;

    // callbacks
    onSelectedRowChanged?: (selectedRowIndex: number, rowData: any) => void;
    onRowDoubleClicked?: (row: any) => void;
    customRowSorter?: (sortBy, sortDirection) => void;
    customCellRenderer?: (args: ICustomCellRendererArgs) => React.ReactNode;
    onGroupByChanged?: (groupBy: Array<IGroupBy>) => void;
    groupRowFormat?: (rowData: any) => string;
    onGroupBySort?: (sortBy: string, sortDirection: SortDirection) => void;
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
    columnFilters?: Array<FiltersData>;
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
    getCellValue?: (rowData) => any;
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

export const defaultMinColumnWidth = 50;
export function getColumnMinWidth(col: GridColumn): number {
    let retVal: number;
    if (col.minWidth instanceof Function) {
        retVal = col.minWidth();
    } else {
        retVal = col.minWidth;
    }
    return retVal || defaultMinColumnWidth;
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
     * used in ShowOnRowHover behaviour to specify actions per row
     */
    onGetSingleRowContextActions?: (rowData) => Array<ActionItem> | ContextActionsObject;
    onActionSelected: (commandName: string, parameters, rowData) => void;
    hideDropdownActionIcons?: boolean;
}

export interface ContextActionsObject {
    actions: Array<ActionItem>;
    dropdownIconName?: string;
    dropdownCustomRenderer?: (rowIndex: number, actions: Array<ActionItem>, onActionClicked: (rowIndex: number, action: ActionItem) => void) => JSX.Element;
}

export function isContextActionsObject(arg: any): arg is ContextActionsObject {
    return arg && arg.actions !== undefined;
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
    showInDropdown?: boolean;
}
export interface FiltersProps {
    headerColumns: Array<GridColumn>;
    width: number;
    columnWidths: Array<number>;
    scrollLeft: number;
    allColumns: Array<GridColumn>;
    columnFilters: Array<FiltersData>;
    groupBy: IGroupBy[];
    hasActionColumn: boolean;
    addColumnFilter: (filterData: FiltersData) => void;
    removeColumnFilter: (filterData: FiltersData) => void;
}

export interface FiltersData {
    columnIndex: number;
    filterValue: string;
}

export interface ColumnFilterProps {
    columnIndex: number;
    filterValue: string;
    isNotEmpty: boolean;
    addColumnFilter: (filterData: FiltersData) => void;
    removeColumnFilter: (filterData: FiltersData) => void;
}
