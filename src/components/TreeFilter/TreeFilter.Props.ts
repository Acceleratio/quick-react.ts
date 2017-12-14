import { DirectionalHint } from '../../utilities/DirectionalHint';
import { ILookupTable } from './TreeItemOperators';

export enum FilterSelectionEnum {
    All,
    None,
    Selected
}

export interface IFilterSelection {
    type: FilterSelectionEnum;
    selectedIDs: Array<string>;
}

export enum CheckStatus {
    Checked,
    NotChecked,
    ChildChecked
}

export interface ITreeFilterProps {
    filterId: string;
    items: Array<TreeItem>;
    title?: string;
    disabled?: boolean;
    filterSelection?: IFilterSelection;
    hasSearch?: boolean;
    isSingleSelect?: boolean;
    isGroupSelectableOnSingleSelect?: boolean;
    itemsAreFlatList?: boolean;
    onValuesSelected?: (filterId: string, filterSelection: IFilterSelection) => void;
    defaultSelection?: FilterSelectionEnum;
    rowHeight?: number;
    hasTitleBorder?: boolean;
    showButtons?: boolean;
    onSave?: (filterId: string, filterSelection: IFilterSelection) => void;
    /* Callout specific */
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    directionalHint?: DirectionalHint;
    clearSearchOnClose?: boolean;
    enabledResizeHandles?: { // all enabled if undefined
        top: boolean,
        right: boolean,
        bottom: boolean,
        left: boolean,
        topRight: boolean,
        bottomRight: boolean,
        bottomLeft: boolean,
        topLeft: boolean
    };
    onItemExpand?: (treeItem?: TreeItem, lookupTableGetter?) => void;
    onCalloutClose?(): void;
}

export const defaultTreeFilterProps: Partial<ITreeFilterProps> = {
    filterId: 'treeFilter',
    hasSearch: true,
    isSingleSelect: false,
    itemsAreFlatList: false,
    isGroupSelectableOnSingleSelect: false,
    directionalHint: DirectionalHint.bottomRightEdge,
    filterSelection: { type: FilterSelectionEnum.None, selectedIDs: [] },
    width: 300,
    height: 350,
    minWidth: 200,
    minHeight: 200,
    defaultSelection: FilterSelectionEnum.None,
    clearSearchOnClose: true,
    rowHeight: 21,
    showButtons: false,
    onCalloutClose: () => { }
};

export interface ITreeFilterState {
    isOpen: boolean;
    // filterSelection: IFilterSelection;
    isDefaultSelected: boolean;
    selectionText: string;
    query: string;
    selection: IFilterSelection;
}

export interface TreeItem {
    id: string;
    value: string;
    expanded?: boolean;
    children?: Array<TreeItem>;
    className?: string;
    iconName?: string;
    iconClassName?: string;
    renderElement?: (itemKey: string, style: any) => JSX.Element;
}
