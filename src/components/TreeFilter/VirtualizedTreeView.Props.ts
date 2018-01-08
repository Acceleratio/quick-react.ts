import { FilterSelectionEnum, TreeItem, IFilterSelection } from './TreeFilter.Props';
import { ItemOperator, ILookupTable, TreeLookups } from './TreeItemOperators';

const nullFunc = () => { };

export interface IVirtualizedTreeViewProps {
    title?: string;
    hasSearch?: boolean;
    filterId: string;
    items: Array<TreeItem>;
    filterSelection?: IFilterSelection;
    isSingleSelect?: boolean;
    showButtons?: boolean;
    onSave?: () => void;
    onCancel?: () => void;
    isGroupSelectableOnSingleSelect?: boolean;
    itemsAreFlatList?: boolean;
    onValuesSelected?: (filterId: string, filterSelection: IFilterSelection) => void;
    defaultSelection?: FilterSelectionEnum;
    rowHeight?: number;
    onItemsSearch?: (query: string) => void;
    searchQuery?: string;
    allItemIdsGetter?: (items?: Array<TreeItem>) => ReadonlyArray<string>;
    lookupTableGetter?: (items?: Array<TreeItem>) => any;
    onItemExpand?: (item?: TreeItem, lookupTableGetter?: () => TreeLookups ) => void;
    showSelectAll?: boolean;
    showStatusBar?: boolean;
}

export const defaultTreeProps: Partial<IVirtualizedTreeViewProps> = {
    filterId: 'treeFilter',
    hasSearch: true,
    isSingleSelect: false,
    itemsAreFlatList: false,
    isGroupSelectableOnSingleSelect: false,
    onValuesSelected: () => { },
    filterSelection: { type: FilterSelectionEnum.None, selectedIDs: [] },
    defaultSelection: FilterSelectionEnum.None,
    rowHeight: 20,
    onItemsSearch: nullFunc,
    searchQuery: '',
    allItemIdsGetter: (items: Array<TreeItem>) => ItemOperator.getAllItemIds(items),
    lookupTableGetter: (items: Array<TreeItem>) => ItemOperator.getLookupTableAndParentLookup(items)
};

export interface IVirtualizedTreeViewState {
    filteredItems: Array<TreeItem>;
    searchText: string;
    partiallyCheckedItemIds: Array<string>;
}
