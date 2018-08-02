import * as React from 'react';
import { List, AutoSizer } from 'react-virtualized';
import Resizable from 'react-resizable-box';
import * as classNames from 'classnames';
import * as _ from 'lodash';

import { Search } from '../Search';
import { Icon } from '../Icon';
import {
    ITreeFilterProps,
    ITreeFilterState,
    TreeItem,
    CheckStatus,
    FilterSelectionEnum,
    IFilterSelection,
    defaultTreeFilterProps
} from './TreeFilter.Props';

import { VirtualizedTreeViewCheckBox } from './VirtualizedTreeViewCheckBox';

import {
    ItemOperator,
    LeafsAndBranches,
    TreeBranch,
    CheckResult,
    itemHasChildren,
    ILookupTable
} from './TreeItemOperators';

import {
    IVirtualizedTreeViewProps,
    IVirtualizedTreeViewState,
    defaultTreeProps
} from './VirtualizedTreeView.Props';

import './VirtualizedTreeView.scss';
import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';
import { SpinnerType } from '../Spinner/Spinner.Props';
import addHoverableButtons from '../HoverableButton/HoverableButton';

export class VirtualizedTreeView extends React.PureComponent<IVirtualizedTreeViewProps, IVirtualizedTreeViewState> {
    private _list: any;

    private parentLookup: Readonly<ILookupTable>;
    private itemLookup: Readonly<ILookupTable>;
    private allItemIds: ReadonlyArray<string>;

    public static defaultProps = defaultTreeProps;

    public constructor (props: IVirtualizedTreeViewProps) {
        super(props);

        this.state = {
            partiallyCheckedItemIds: [],
            searchText: props.searchQuery,
            filteredItems: ItemOperator.filterItems(props.items, props.searchQuery),
            scrollToIndex: undefined
        };

        const lookups = this.props.lookupTableGetter(props.items);
        this.parentLookup = lookups.parentLookup;
        this.itemLookup = lookups.itemLookup;

        this.allItemIds = this.props.allItemIdsGetter(props.items);

    }

    public componentWillMount() {
        let scrollToIndex = undefined;
        const checkedItemIds = this.props.filterSelection.type === FilterSelectionEnum.All ? this.allItemIds : this.props.filterSelection.selectedIDs;

        if (this.props.filterSelection.type !== FilterSelectionEnum.All && checkedItemIds.length > 0) {
            scrollToIndex = this.state.filteredItems.findIndex((element) => {
                return element.id === checkedItemIds[0];
            });
            if (scrollToIndex === -1) {
                // find the top level id of the nested checked item
                let parent = this.parentLookup[checkedItemIds[0]];   
                while (parent !== undefined) {
                    if (typeof parent.id === 'number') {
                        scrollToIndex = parent.id;
                        break;
                    }
                    parent = this.parentLookup[parent.id];
                }          
            }
            this.setState({ scrollToIndex });
        }
    }

    public componentWillReceiveProps(nextProps: IVirtualizedTreeViewProps) {

        if (nextProps.items !== this.props.items || this.state.searchText !== nextProps.searchQuery) {
            const filteredItems = ItemOperator.filterItems(nextProps.items, this.state.searchText);
            this.setState(
                prevState => ({
                    ...prevState,
                    filteredItems: filteredItems,
                    searchText: nextProps.searchQuery,
                    scrollToIndex: undefined
                })
            );
        }

        const lookups = nextProps.lookupTableGetter(nextProps.items);
        this.parentLookup = lookups.parentLookup;
        this.itemLookup = lookups.itemLookup;

        this.allItemIds = nextProps.allItemIdsGetter(nextProps.items);
    }

    public componentDidUpdate(prevProps: ITreeFilterProps, prevState: IVirtualizedTreeViewState) {
        if (this.state.filteredItems !== prevState.filteredItems) {
            if (this._list != null) {
                this._list.recomputeRowHeights();
            }
        } else if (this.props.filterSelection.selectedIDs !== prevProps.filterSelection.selectedIDs) {
            if (this._list != null) {
                this._list.forceUpdateGrid();
            }
        }
    }

    public render() {
        const { title, hasSearch, isSingleSelect, defaultSelection, itemsAreFlatList, showStatusBar, showSelectAll } = this.props;

        const allSelected = this.getAllSelectedCheckMark();

        const checkedItemIds =
            this.props.filterSelection.type === FilterSelectionEnum.All ?
                this.allItemIds :
                this.props.filterSelection.selectedIDs;
        const virtualizedTreeClassName = classNames(
            'virtualized-tree-filter-container',
            {
                'is-single-select': isSingleSelect,
                'is-flat-list': itemsAreFlatList && showSelectAll
            }
        );

        return (
            <div className={ virtualizedTreeClassName } style={ { width: '100%', height: '100%' } }>
                {
                    title && <label className="virtualized-tree-filter-title" title={ title }>{ title }</label>
                }
                {
                    hasSearch && <Search value={ this.state.searchText } onChange={ this.searchItems } className="filter-search" />
                }
                {
                    !isSingleSelect && showSelectAll &&
                    <VirtualizedTreeViewCheckBox
                        text="Select All"
                        itemId="ALL"
                        checked={ allSelected }
                        onChange={ this.onSelectAllChange }
                    />
                }
                <AutoSizer>
                    { ({ width, height }) => (
                        <List
                            height={ this.getListHeight(height) }
                            width={ width }
                            overscanRowCount={ 10 }
                            ref={ this.setListReference }
                            rowHeight={ this.rowHeight }
                            rowRenderer={ this.rowRenderer }
                            rowCount={ this.state.filteredItems.length }
                            scrollToIndex={ this.state.scrollToIndex }
                        />
                    ) }
                </AutoSizer>
                {
                    !isSingleSelect && showStatusBar &&
                    <label
                        className={ classNames('virtualized-tree-filter-footer-count', { 'virtualized-tree-filter-footer-with-button': this.props.showButtons }) }>
                        Selected: { checkedItemIds.length }/{ this.allItemIds.length }
                    </label>
                }
                {
                    this.props.showButtons &&
                    <div className={ 'tree-filter-actions' }>
                        <div className={ 'tree-filter-actionsRight' }>
                            <Button className="button-textual" onClick={ this.props.onCancel }>Cancel</Button>
                            <Button className="button-primary" onClick={ this.props.onSave }>Save</Button>
                        </div>
                    </div>
                }
            </div>
        );
    }

    private rowRenderer = ({ index, key, parent, style }) => {
        return (
            <div key={ key } style={ style }>
                { this.renderItem(this.state.filteredItems[index], index) }
            </div>
        );
    }
    private renderItem(treeItem: TreeItem, itemKey) {
        if (treeItem.renderElement) {
            const style = {
                height: this.props.rowHeight,
                marginLeft: this.props.itemsAreFlatList ? 0 : 18
            };
            return treeItem.renderElement(itemKey, style);
        }
        const onExpandClick = (event) => {
            event.stopPropagation();
            if (this.props.onItemExpand) {
                this.props.onItemExpand(treeItem, this.props.lookupTableGetter);
            } else {
                treeItem.expanded = !treeItem.expanded;
                this._list.recomputeRowHeights();
            }
        };

        const filterSelection = this.props.filterSelection;
        const checkedItemIds = filterSelection.type === FilterSelectionEnum.All ? this.allItemIds : filterSelection.selectedIDs;
        const itemChecked = this.isItemInList(checkedItemIds, treeItem);
        const itemCheckedOrAllFilteredChecked = itemChecked || (this.state.searchText !== '' && this.allFilteredChildrenChecked(treeItem, checkedItemIds));

        const onItemCheckedChange = () => {
            const newCheckedAndPartial = this.getNewCheckedItems(treeItem, checkedItemIds, itemCheckedOrAllFilteredChecked);
            this.setNewSelectedState(false, newCheckedAndPartial.checked, newCheckedAndPartial.partially);
        };

        const onSingleSelectItemClick = () => {
            if (this.props.isGroupSelectableOnSingleSelect === false && itemHasChildren(treeItem)) {
                return;
            }
            this.props.onValuesSelected(this.props.filterId, { type: FilterSelectionEnum.Selected, selectedIDs: [treeItem.id] });
        };

        // tslint:disable-next-line:variable-name
        const ItemCheckboxElement = () => {
            const iconClassName = classNames(
                'virtualized-tree-item-icon',
                treeItem.iconClassName
            );

            let { id, hoverOverBtn } = treeItem;

            if (this.props.isSingleSelect) {
                const singleSelectClassNames = classNames(
                    'virtualized-tree-single-select-item',
                    {
                        'selected': itemChecked
                    }
                );
                const SingleSelectItem = ({ }) =>
                    <span
                        className={ singleSelectClassNames }
                        onClick={ onSingleSelectItemClick }
                    >
                        { treeItem.iconName &&
                            <span title={ treeItem.iconTooltipContent }>
                                <Icon iconName={ treeItem.iconName } className={ iconClassName } />
                            </span>
                        }
                        <span title={ treeItem.value }>{ treeItem.value }</span>
                    </span>;
                const SingleSelectItemWithButtons = addHoverableButtons({ item: treeItem, hoverOverBtn })(SingleSelectItem);

                return <SingleSelectItemWithButtons />;
            } else {
                let checked = itemChecked ? CheckStatus.Checked : CheckStatus.NotChecked;
                if (this.isItemInList(this.state.partiallyCheckedItemIds, treeItem) && this.props.enableRecursiveSelection) {
                    checked = CheckStatus.ChildChecked;
                }

                const ItemWithButtons = addHoverableButtons({ item: treeItem, hoverOverBtn })(VirtualizedTreeViewCheckBox);
                return (
                    <ItemWithButtons
                        itemId={ treeItem.id }
                        text={ treeItem.value }
                        checked={ checked }
                        onChange={ onItemCheckedChange }
                        iconName={ treeItem.iconName }
                        iconClassName={ iconClassName }
                        iconTooltipContent={ treeItem.iconTooltipContent }
                    />
                );
            }
        };

        if (treeItem.expanded) {
            return (
                <div key={ itemKey } >
                    <div className="item-container expandible-item" style={ { height: this.props.rowHeight } } >
                        <Icon className="virtualized-tree-expand-icon" iconName={ 'icon-arrow_down_right' } onClick={ onExpandClick } />
                        <ItemCheckboxElement />
                    </div>
                    { itemHasChildren(treeItem) &&
                        <ul>
                            <li>
                                {
                                    treeItem.children.map((child, index) => {
                                        return this.renderItem(child, itemKey + '-' + index);
                                    })
                                }
                            </li>
                        </ul>
                    }
                    {
                        treeItem.asyncChildrenLoadInProgress &&
                        <ul>
                            <li>
                                {
                                    this.renderAsyncLoadingNode(itemKey)
                                }
                            </li>
                        </ul>
                    }
                </div>
            );
        } else if (itemHasChildren(treeItem) || treeItem.hasChildren) { // expandable
            return (
                <div className="item-container expandible-item" key={ itemKey } style={ { height: this.props.rowHeight } } >
                    <Icon className="virtualized-tree-expand-icon" iconName={ 'icon-arrow_right' } onClick={ onExpandClick } />
                    <ItemCheckboxElement />
                </div>
            );
        } else { // leaf
            const marginLeft = this.props.itemsAreFlatList ? 0 : 18;
            return (
                <div className="item-container" key={ itemKey } style={ { height: this.props.rowHeight, marginLeft: marginLeft } }>
                    <ItemCheckboxElement />
                </div>
            );
        }
    }

    private renderAsyncLoadingNode(loadingTreeNodeKey) {
        const style = {
            height: this.props.rowHeight,
            marginLeft: this.props.isSingleSelect ? 6 : 18
        };
        return (
            <div
                key={ loadingTreeNodeKey + '_Loading' }
                className="item-container loading-container"
                style={ style }
            >
                <Spinner className="tree-view-async-loading-spinner"
                    type={ SpinnerType.small }
                />
                <span className="tree-view-async-loading-label">
                    Loading...
                    </span>
            </div>
        );
    }

    private isItemInList(list, treeItem: TreeItem): boolean {
        return list.indexOf(treeItem.id) !== -1;
    }

    private rowHeight = ({ index }) => {
        return this.getExpandedItemCount(this.state.filteredItems[index]) * this.props.rowHeight;
    }

    private getExpandedItemCount = (item: TreeItem) => {
        let count = 1;
        if (item.expanded) {
            count += item.children
                .map(this.getExpandedItemCount)
                .reduce(function (total, currentCount) { return total + currentCount; }, 0) + (item.asyncChildrenLoadInProgress ? 1 : 0);
        }
        return count;
    }

    private setListReference = (ref) => {
        this._list = ref;
    }

    private searchItems = (searchText: string) => {
        const newItems = ItemOperator.filterItems(this.props.items, searchText);
        this.setState(prevState => ({
            ...prevState,
            searchText: searchText,
            filteredItems: newItems
        }));
        this.props.onItemsSearch(searchText);
    }

    private onSelectAllChange = () => {
        const checkedItemIds = this.props.filterSelection.selectedIDs;
        const allSelected = this.props.filterSelection.type === FilterSelectionEnum.All;
        if (this.props.itemsAreFlatList) {
            if (allSelected || this.allFilteredChecked()) {
                let newCheckedItems = _.without<any>(checkedItemIds, ...(this.state.filteredItems.map(item => item.id)));
                this.setNewSelectedState(false, newCheckedItems, []);
            } else {
                let newCheckedItems = checkedItemIds.slice(0).concat(this.state.filteredItems.map(item => item.id));
                newCheckedItems = _.uniq(newCheckedItems);
                this.setNewSelectedState(false, newCheckedItems, []);
            }
        } else { // tree structure
            if (this.state.searchText === '') {
                if (!this.props.enableRecursiveSelection) {
                    this.setNewSelectedState(!allSelected, [], []);
                } else if (allSelected) {
                    this.setNewSelectedState(false, [], []);
                } else {
                    this.setNewSelectedState(true, [], []);
                }
            } else { // filtered
                const filteredItems = this.state.filteredItems;
                const allFilteredChecked =
                    _.every(filteredItems,
                        (filteredItem) =>
                            this.isItemInList(checkedItemIds, filteredItem) ||
                            this.isItemInList(this.state.partiallyCheckedItemIds, filteredItem));

                let itemsToChange = [];
                let branchesToCheck = [];

                for (let item of filteredItems) {
                    const leafsAndBranches = ItemOperator.getAllLeafsAndBranches(item, this.itemLookup[item.id]);
                    itemsToChange = itemsToChange.concat(leafsAndBranches.Leafs);
                    branchesToCheck = branchesToCheck.concat(leafsAndBranches.Branches);
                }
                // filtriraj flat vrijednosti
                /*if (!this.props.enableRecursiveSelection ) {
                    itemsToChange = _.without<any>(itemsToChange, ...ItemOperator.getAllItemIds(filteredItems));
                }*/

                let newCheckedItems: Array<string> = [];
                if (allFilteredChecked) {
                    newCheckedItems = _.without<any>(checkedItemIds, ...itemsToChange);
                } else {
                    newCheckedItems = checkedItemIds.slice(0).concat(itemsToChange);
                    newCheckedItems = _.uniq(newCheckedItems);
                }
                const newCheckedAndPartial = this.checkBranches(branchesToCheck, newCheckedItems, this.state.partiallyCheckedItemIds);
                this.setNewSelectedState(false, newCheckedAndPartial.checked, newCheckedAndPartial.partially);
            }
        }
    }

    private allFilteredChecked = () => {
        return _.every(this.state.filteredItems, (item) => this.isItemInList(this.props.filterSelection.selectedIDs, item));
    }

    private areAllItemsSelected = (checkedItemIds): CheckStatus => {
        if (_.every(this.props.items, (item) => this.isItemInList(checkedItemIds, item))) {
            return CheckStatus.Checked;
        }
        if (checkedItemIds.length > 0) {
            return CheckStatus.ChildChecked;
        }
        return CheckStatus.NotChecked;
    }

    private getNewCheckedItems(changedTreeItem: TreeItem, checkedItemIds, wasChecked): CheckResult {
        let itemsToChange = [];
        let branchesToCheck = [];

        if (!this.props.enableRecursiveSelection) {
            itemsToChange.push(changedTreeItem.id);
            const parent = this.parentLookup[changedTreeItem.id];
            if (parent !== undefined) {
                branchesToCheck.push({ id: parent.id, depth: 0 });
            }
        } else if (this.state.searchText === '') {
            itemsToChange = ItemOperator.getAllChildrenIds(changedTreeItem);
            if (itemHasChildren(changedTreeItem)) {
                branchesToCheck.push({ id: changedTreeItem.id, depth: 0 });
            } else {
                itemsToChange.push(changedTreeItem.id);
                const parent = this.parentLookup[changedTreeItem.id];
                if (parent !== undefined) {
                    branchesToCheck.push({ id: parent.id, depth: 0 });
                }
            }
        } else {
            let leafsAndBranches = ItemOperator.getAllLeafsAndBranches(changedTreeItem, this.itemLookup[changedTreeItem.id]);
            itemsToChange = leafsAndBranches.Leafs;
            branchesToCheck = leafsAndBranches.Branches;
            const parent = this.parentLookup[changedTreeItem.id];
            if (branchesToCheck.length === 0 && parent !== undefined) {
                branchesToCheck.push({ id: parent.id, depth: 0 });
            }
        }

        let newCheckedItems: Array<string> = [];
        if (wasChecked) {
            newCheckedItems = _.without<any>(checkedItemIds, ...itemsToChange);
        } else {
            newCheckedItems = checkedItemIds.slice(0).concat(itemsToChange);
            newCheckedItems = _.uniq(newCheckedItems);
        }
        const branchCheckRes = this.checkBranches(branchesToCheck, newCheckedItems, this.state.partiallyCheckedItemIds);
        return branchCheckRes;
    }

    private checkBranches(branches: Array<TreeBranch>, checked: Array<string>, partiallyChecked: Array<string>): CheckResult {
        let newChecked = [...checked];
        let newPartiallyChecked = [...partiallyChecked];

        while (branches.length > 0) {
            const checkItem = this.popMaxDepthBranch(branches);
            let item = this.itemLookup[checkItem.id];
            let isChecked = true;
            let isPartiallyChecked = false;
            for (let child of item.children) {
                let childChecked = this.isItemInList(newChecked, child);
                let childPartial = isPartiallyChecked || this.isItemInList(newPartiallyChecked, child);
                if (!childChecked) {
                    isChecked = false;
                }
                if (childChecked || childPartial) {
                    isPartiallyChecked = true;
                }
                if (!isChecked && isPartiallyChecked) { // no need to check others
                    break;
                }
            }
            isPartiallyChecked = !isChecked && isPartiallyChecked; // item cannot be checked and partial

            // Add/Remove from lists
            if (this.props.enableRecursiveSelection) {
                this.modifyListForItem(newChecked, item.id, isChecked);
            }
            this.modifyListForItem(newPartiallyChecked, item.id, isPartiallyChecked);

            const parent = this.parentLookup[checkItem.id];
            if (parent !== undefined) {
                branches.push({ id: parent.id, depth: 0 });
            }
        }
        return { checked: newChecked, partially: newPartiallyChecked };
    }

    private modifyListForItem(list: Array<string>, itemId: string, addItem: boolean) {
        const itemIndex = list.indexOf(itemId);
        if (addItem && itemIndex === -1) {
            list.push(itemId);
        } else if (!addItem && itemIndex !== -1) {
            list.splice(itemIndex, 1);
        }
    }

    private popMaxDepthBranch(branches: Array<TreeBranch>) {
        let maxDepth = -1;
        let maxItemIndex = -1;
        for (let index = 0; index < branches.length; index++) {
            let element = branches[index];
            if (element.depth > maxDepth) {
                maxDepth = element.depth;
                maxItemIndex = index;
            }
        }
        let maxBranch = branches.splice(maxItemIndex, 1)[0];
        return maxBranch;
    }

    private setNewSelectedState(allChecked: boolean, newChecked, newPartiallyChecked) {
        if (!this.props.enableRecursiveSelection) {
            let newType = FilterSelectionEnum.None;
            let selectedIDs = [];

            if (newChecked.length === this.allItemIds.length || allChecked) {
                newType = FilterSelectionEnum.All;
            } else if (newChecked.length > 0) {
                selectedIDs = newChecked;
                newType = FilterSelectionEnum.Selected;
            }

            this.props.onValuesSelected(this.props.filterId, { type: newType, selectedIDs: selectedIDs });
            this.setState(prevState => ({ ...prevState, partiallyCheckedItemIds: newPartiallyChecked }));
            return;
        }

        const allSelected = allChecked || this.areAllItemsSelected(newChecked) === CheckStatus.Checked;
        if (allSelected) {
            this.props.onValuesSelected(this.props.filterId, { type: FilterSelectionEnum.All, selectedIDs: [] });
        } else if (newChecked.length > 0) {
            this.props.onValuesSelected(this.props.filterId, { type: FilterSelectionEnum.Selected, selectedIDs: newChecked });
        } else {
            this.props.onValuesSelected(this.props.filterId, { type: FilterSelectionEnum.None, selectedIDs: [] });
        }
        this.setState(prevState => ({ ...prevState, partiallyCheckedItemIds: newPartiallyChecked }));
    }

    private getBoxSupportElementsHeight = () => {
        let heightDiff = 0;
        if (!this.props.isSingleSelect && this.props.showStatusBar) { heightDiff += 20; }
        if (this.props.showSelectAll) { heightDiff += 21; }
        if (this.props.hasSearch) { heightDiff += 42; }
        if (this.props.showButtons) { heightDiff += 22; }
        return heightDiff;
    }

    private getListHeight = (totalHeight) => {
        return totalHeight - this.getBoxSupportElementsHeight();
    }

    private allFilteredChildrenChecked = (treeItem: TreeItem, checkedItemIds) => {
        if (this.props.itemsAreFlatList) { return false; }
        return itemHasChildren(treeItem) &&
            _.every(treeItem.children,
                (child) => this.isItemInList(checkedItemIds, child) || this.isItemInList(this.state.partiallyCheckedItemIds, child));
    }

    private getAllSelectedCheckMark = () => {
        let allSelected = CheckStatus.NotChecked;
        if (this.props.filterSelection.type === FilterSelectionEnum.All) {
            allSelected = CheckStatus.Checked;
        } else if (this.props.filterSelection.type === FilterSelectionEnum.Selected) {
            allSelected = CheckStatus.ChildChecked;
        }
        return allSelected;
    }
}
