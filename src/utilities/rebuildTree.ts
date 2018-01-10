import { TreeItem } from '../components/TreeFilter/TreeFilter.Props';
import { ILookupTable, TreeLookups } from '../components/TreeFilter/TreeItemOperators';

export function rebuildTree(newTreeItem: TreeItem, lookupGetter): TreeItem {
    let treeItem = { ...newTreeItem };
    let parentLookup = lookupGetter().parentLookup;
    let parentItem = parentLookup[treeItem.id];

    while (parentItem != null) {
        const childIndex = parentItem.children.findIndex((item) => item.id === treeItem.id);
        if (childIndex === -1) {
            throw new Error('Parent item does not contain given child key.');
        }
        const modifiedChildren = [...parentItem.children];
        modifiedChildren.splice(childIndex, 1, treeItem);
        treeItem = {
            ...parentItem,
            children: modifiedChildren
        };
        parentItem = parentLookup[treeItem.id];
    }
    return treeItem;
}

export function updateTree(root: TreeItem[], newTreeItem: TreeItem, lookupGetter): TreeItem[] {
    const rebuiltSubtree = rebuildTree(newTreeItem, lookupGetter);
    const index = root.findIndex((item) => item.id === rebuiltSubtree.id);
    if (index === -1) {
        throw new Error('Root item does not contain given child key.');
    }
    let modifiedRoot = [...root];
    modifiedRoot.splice(index, 1, rebuiltSubtree);
    return modifiedRoot;
}

export function expandOrCollapseTreeItem(root: TreeItem[], treeItemToExpand: TreeItem, lookupGetter): TreeItem[] {
    const flippedTreeItem: TreeItem = {
        ...treeItemToExpand,
        expanded: !treeItemToExpand.expanded
    };
    return updateTree(root, flippedTreeItem, lookupGetter);
}

export function expandOrCollapseAsyncTreeItem(getRoots: () => TreeItem[], treeItemToExpand: TreeItem, lookupTableGetter: () => TreeLookups, onTreeUpdated: (newRoots: TreeItem[]) => void, asyncItemsGetter: () => Promise<TreeItem[]>): void {
    const flippedTreeItem: TreeItem = {
        ...treeItemToExpand,
        expanded: !treeItemToExpand.expanded
    };
    if (flippedTreeItem.expanded && asyncItemsGetter) {
        const willPerformAsyncLoad = flippedTreeItem.children.length === 0 && flippedTreeItem.hasChildren && !flippedTreeItem.asyncChildrenLoadInProgress;
        if (willPerformAsyncLoad) {
            flippedTreeItem.asyncChildrenLoadInProgress = true;

            asyncItemsGetter().then(items => {
                let currentItem = lookupTableGetter().itemLookup[flippedTreeItem.id];
                currentItem = {
                    ...currentItem,
                    children: items,
                    hasChildren: items.length > 0,
                    asyncChildrenLoadInProgress: false
                };

                onTreeUpdated(updateTree(getRoots(), currentItem, lookupTableGetter));
            }, () => {
                let currentItem = lookupTableGetter().itemLookup[flippedTreeItem.id];
                currentItem = {
                    ...currentItem,
                    children: [],
                    hasChildren: false,
                    asyncChildrenLoadInProgress: false
                };
                
                onTreeUpdated(updateTree(getRoots(), currentItem, lookupTableGetter));
            });
        }
    }

    onTreeUpdated(updateTree(getRoots(), flippedTreeItem, lookupTableGetter));
}
