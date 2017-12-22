import { ITreeFilterProps, ITreeFilterState, TreeItem } from './treeFilter.Props';
import * as _ from 'lodash';

export interface TreeBranch {
    id: string;
    depth: number;
}

export interface LeafsAndBranches {
    Leafs: Array<string>;
    Branches: Array<TreeBranch>;
}

export interface CheckResult {
    checked: Array<string>;
    partially: Array<string>;
}

export interface ILookupTable {
    [id: string]: TreeItem;
}

export interface TreeLookups {
    parentLookup: ILookupTable;
    itemLookup: ILookupTable;
}

/**
 * Check if current tree item has children by checking if its children property
 * is not null and its length is greater than 0.
 * @param item Current tree item.
 */
export const itemHasChildren = (item: TreeItem) => {
    return item.children != null && item.children.length !== 0;
};

export class ItemOperator {
    static getLookupTableAndParentLookup = (items: Array<TreeItem>): TreeLookups => {
        let parentItems: ILookupTable = {};
        let lookup: ILookupTable = {};

        if (items == null || items.length === 0) {
            return {
                parentLookup: parentItems,
                itemLookup: lookup
            };
        }

        const setParentAndLookup = (parent, children: Array<TreeItem>) => {
            for (let item of children) {
                lookup[item.id] = item;
                parentItems[item.id] = parent;
                if (itemHasChildren(item)) {
                    setParentAndLookup(item, item.children);
                }
            }
        };

        setParentAndLookup(undefined, items);

        return {
            parentLookup: Object.freeze(parentItems),
            itemLookup: Object.freeze(lookup)
        };
    }

    /**
     * Returns ids of all items in tree structure in single array.
     */
    static getAllItemIds = (entryItems: Array<TreeItem>) => {
        const getItemIdsRecursive = (items) => {
            let itemIds = [];

            if (items == null || items.length === 0) {
                return itemIds;
            }

            for (let item of items) {
                itemIds.push(item.id);
                itemIds = itemIds.concat(getItemIdsRecursive(item.children));
            }

            return itemIds;
        };
        let allItems = getItemIdsRecursive(entryItems);
        return Object.freeze(allItems);
    }

    /**
     * Returns ids of all children that are children of current item or any
     * of its child recursive.
     */
    static getAllChildrenIds = (currentItem: TreeItem): Array<string> => {
        let childrenIds: Array<string> = [];
        if (itemHasChildren(currentItem)) {
            currentItem.children.forEach(childElement => {
                childrenIds.push(childElement.id);
                childrenIds = childrenIds.concat(ItemOperator.getAllChildrenIds(childElement));
            });
        }
        return childrenIds;
    }

    static getAllLeafsAndBranches = (currentItem: TreeItem, originalItem: TreeItem): LeafsAndBranches => {
        let leafs = [];
        let branches: Array<TreeBranch> = [];

        const checkItemRecursive = (item: TreeItem, depth) => {
            const children = item.children;
            if (itemHasChildren(item)) {
                branches.push({ id: item.id, depth: depth });
                children.forEach(childElement => {
                    checkItemRecursive(childElement, depth + 1);
                });
            } else {
                leafs.push(item.id);
            }
        };

        if (itemHasChildren(currentItem)) {
            branches.push({
                id: currentItem.id,
                depth: 0
            });

            currentItem.children.forEach(childElement => {
                checkItemRecursive(childElement, 1);
            });
        } else if (itemHasChildren(originalItem)) { // when all children are filtered with search
            branches.push({
                id: originalItem.id,
                depth: 0
            });

            originalItem.children.forEach(childElement => {
                checkItemRecursive(childElement, 1);
            });
        } else {
            leafs.push(currentItem.id);
        }

        return {
            Leafs: leafs,
            Branches: branches
        };
    }

    /**
     * Filters given array of tree items based on given search string.
     * Values and search query will be converted to lowercase before so this
     * search is case insensitive.
     */
    static filterItems = (items: Array<TreeItem>, query: string): Array<TreeItem> => {
        let filteredItems: Array<TreeItem> = [];
        query = query.toLowerCase();

        if (items == null || items.length === 0) {
            return filteredItems;
        }

        if (query === '') {
            return items;
        }

        for (let item of items) {
            if (item.value.toLowerCase().search(query) !== -1) {
                let newItem: TreeItem = { ...item, children: [], expanded: false };
                filteredItems.push(newItem);
            } else if (itemHasChildren(item)) {
                const filteredChildren = ItemOperator.filterItems(item.children, query);
                if (filteredChildren.length > 0) {
                    let newItem: TreeItem = { ...item, children: filteredChildren, expanded: true };
                    filteredItems.push(newItem);
                }
            }
        }

        return filteredItems;
    }
}
