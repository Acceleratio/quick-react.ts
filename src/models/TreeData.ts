import * as _ from 'lodash';
import { IDictionary } from '../utilities/common';
import { IObservable } from '../utilities/observable';
import { removeLookupEntry, addLookupEntry } from '../utilities/immutable';

export interface TreeNode { // extend this interface on a data structure to be used for row data    
    isExpanded?: boolean;
    children?: Array<TreeNode>;
    hasChildren?: boolean;
    iconName?: string;
    iconTooltipContent?: string;
    iconClassName?: string;
    id?: string;
    className?: string;
}

export interface IFinalTreeNode extends TreeNode {
    nodeId?: number;
    parentId?: number; // nodeId of the parent node
    nodeLevel: number;
    sortRequestId: number;
    isLazyChildrenLoadInProgress?: boolean;
    isAsyncLoadingDummyNode?: boolean;
    children: Array<IFinalTreeNode>;
    parent: IFinalTreeNode;
    satisfiesFilterCondition?: boolean;
    descendantSatisfiesFilterCondition?: boolean;
}

export interface ILookupTable {
    [id: number]: IFinalTreeNode;
}

export type IdGetter = (node: TreeNode) => string | number;

export type SelectedIdListener = (selectedIds: Array<string>) => void;

export type DataListener = (selectedIds: Array<IFinalTreeNode>) => void;

const defaultIdMember = (node: IFinalTreeNode) => node.nodeId;

/**
 * This class is meant to work with th TreeGrid component.
 * This class breaks the immutability principle of redux
 * but all mutation is done within this class and in conjunction with the TreeGrid component
 * This is done because of performance reasons
 * it is important to be aware of the fact that the input data for this datasource will be mutated
 * the mutation will occur when this class is created, also all operations that mutate the data.
 * All operations that mutate the data will return a new instance of TreeDataSource
 * this allows us to view the TreeDataSource as immutable when performing actions in our reducers
 * ie. we add a new child to the tree, react will register the change and the TreeGrid component will update because of the prop change
 */
export class TreeDataSource implements IObservable<React.Component> {
    private subscribers: Array<React.Component> = [];
    private dataListeners: Array<DataListener> = [];
    private selectedIdsListeners: Array<SelectedIdListener> = [];

    public enableRecursiveSelection: boolean;

    public subscribe(listener: React.Component<{}, {}>): void {
        this.subscribers.push(listener);
    }

    public unsubscribe(listener: React.Component<{}, {}>): void {
        const index = this.subscribers.findIndex(l => Object.is(listener, l));
        this.subscribers.slice(index, 1);
    }

    public registerDataListener = (dataListener: DataListener) => {
        this.dataListeners.push(dataListener);
    }

    public removeDataListener = (dataListener: DataListener) => {
        const index = this.subscribers.findIndex(l => Object.is(dataListener, l));
        this.dataListeners.slice(index, 1);
    }

    public registerSelectedIdsListener = (selectedIdsListener: SelectedIdListener) => {
        this.selectedIdsListeners.push(selectedIdsListener);
    }

    private notifyWithSelectedIds = () => {
        const selectedIds = Object.keys(this.selectedIds);
        this.selectedIdsListeners.forEach(selectedIdListener => selectedIdListener(selectedIds));
    }

    private notifyWithSelectedNodes = () => {
        const selectedIds = Object.keys(this.selectedIds);
        const nodes = selectedIds.map(id => this.nodesById[id] as IFinalTreeNode);
        this.dataListeners.forEach(dataListener => dataListener(nodes));
    }

    public setRecursiveSelection(isEnabled: boolean) {
        this.enableRecursiveSelection = isEnabled;
        this.updateSelectStrategy(isEnabled);
    }

    public notify = () => this.subscribers.forEach(l => l.forceUpdate());

    private idCounter: number = 0;

    // this would constitute a really dirty hack
    // React shallow compares each prop that is an object before even calling ShouldComponentUpdate    
    // To force react to event consider updating a component(event if it is not pure) we need to pass an object that has some change
    // Since we are copying everything from the previous iteration we need at least one field that actually changes    
    private changeIteration: number = 0;
    private treeStructure: IFinalTreeNode;
    public isEmpty: boolean;

    /** Lookup that holds parent object for given node */
    // private parentLookup: ILookupTable;

    /** Lookup that returns node object for given node id */
    private nodesById: ILookupTable;

    private idMember: string | IdGetter;

    // items used for row selection
    private selectedIds: IDictionary<boolean>;
    private partiallySelectedIds: IDictionary<boolean>;

    private _selectItemsStrategy: (item: IFinalTreeNode) => void;
    private _removeItemsStrategy: (item: IFinalTreeNode) => void;


    get SelectedNodes(): IDictionary<boolean> {
        return this.selectedIds;
    }

    get PartiallySelectedNodes(): IDictionary<boolean> {
        return this.partiallySelectedIds;
    }

    public setSelectedIds(items: Array<number | string>) {
        this.selectedIds = {};
        this.partiallySelectedIds = {};

        if (items.length === 0) {
            this.notifyWithSelectedNodes();
            this.notify();
        }

        items.forEach(i => this._selectItemsStrategy(this.nodesById[i]));
    }

    public selectAll() {
        this.updateSelectedItems(this.treeStructure);
    }

    public deselectAll() {
        this.removeSelectedItems(this.treeStructure);
    }

    /**
     * 
     * @param root warning: will be mutated and returned as ITreeDataSource
     */
    constructor(
        input: TreeNode | TreeDataSource | Array<any>,
        idMember: (string | IdGetter) = defaultIdMember,
        enableRecursiveSelection: boolean = true,
        selectedNodes: Array<number | string> = []
    ) {
        this.updateSelectStrategy(enableRecursiveSelection);

        this.idMember = idMember;
        this.partiallySelectedIds = {};
        this.selectedIds = {};

        if (this.isDataSource(input)) {
            this.nodesById = input.nodesById;
            this.idCounter = input.idCounter;
            this.treeStructure = input.treeStructure;
            this.changeIteration = input.changeIteration + 1;
            this.selectedIds = input.selectedIds;
            this.partiallySelectedIds = input.partiallySelectedIds;
            this.enableRecursiveSelection = input.enableRecursiveSelection;
            this.updateSelectStrategy(input.enableRecursiveSelection);
            this.idMember = input.idMember;
            this.dataListeners = input.dataListeners;
            this.subscribers = input.subscribers;
            this.selectedIdsListeners = input.selectedIdsListeners;
        } else {
            let rootNode: TreeNode = this.isRootNodesArray(input) ? { children: input } : input;
            this.nodesById = {};
            this.extendNodes(input, rootNode.children, 0);
            this.treeStructure = <IFinalTreeNode>rootNode;
            this.isEmpty = this.treeStructure.children.length === 0;
            this.setSelectedIds(selectedNodes);
        }
    }

    public setSelected(item: IFinalTreeNode) {
        this._selectItemsStrategy(item);
    }

    public removeSelected(item: IFinalTreeNode) {
        this._removeItemsStrategy(item);
    }

    /**
     * Returns unique parameter for given node.
     */
    public getIdMember = (node: TreeNode): string | number => {
        if (typeof this.idMember === 'function') {
            return this.idMember(node);
        }

        if (!node.hasOwnProperty(this.idMember)) {
            throw Error('Object doesn\'t have specified property for given key.');
        }

        return node[this.idMember];
    }

    private updateSelectStrategy(enableRecursiveSelection: boolean) {
        this.enableRecursiveSelection = enableRecursiveSelection;
        if (enableRecursiveSelection) {
            this._removeItemsStrategy = this.removeSelectedItems;
            this._selectItemsStrategy = this.updateSelectedItems;
        } else {
            this._removeItemsStrategy = this.removeSelectedItem;
            this._selectItemsStrategy = this.setSelectedItem;
        }
    }

    private updateSelectedItems = (node: IFinalTreeNode) => {
        // get all selected items from this node up to all children
        const selectedIds = this.checkRecursive(node);

        // merge old selected items and new selected items
        this.selectedIds = { ...this.selectedIds, ...selectedIds };

        const nodeId = this.getIdMember(node);

        // if it was partially selected before, remove it from partial selection
        if (this.partiallySelectedIds.hasOwnProperty(nodeId)) {
            this.partiallySelectedIds = removeLookupEntry(nodeId, this.partiallySelectedIds);
        }

        if (this.checkObject(node.parent) && this.getIdMember(node.parent) !== undefined) {
            this.checkIfAllChildrenAreSelected(node.parent, nodeId, selectedIds);
        }

        this.notifyWithSelectedNodes();
        this.notify();
    }

    private partiallySelectItem = (node: IFinalTreeNode) => {
        const nodeId = this.getIdMember(node);
        this.selectedIds = removeLookupEntry(nodeId, this.selectedIds);
        this.partiallySelectedIds = addLookupEntry(nodeId, true, this.partiallySelectedIds);

        if (!this.checkObject(node.parent)) {
            return;
        }

        this.partiallySelectItem(node.parent);
    }

    private checkIfAllChildrenAreSelected = (
        node: IFinalTreeNode,
        childNodeId: number | string,
        nodeChildrenSubset: IDictionary<boolean>
    ) => {
        const nodeId = this.getIdMember(node);
        const allChildren = { ...this.checkRecursive(node, false, { [childNodeId]: true }), ...nodeChildrenSubset };
        const allChildrenKeys = Object.keys(allChildren);
        const allSelectedItemKeys = Object.keys(this.selectedIds);
        const diff = _.difference(allChildrenKeys, allSelectedItemKeys);

        if (diff.length === allChildrenKeys.length) {
            this.partiallySelectedIds = removeLookupEntry(nodeId, this.partiallySelectedIds);
            if (this.checkObject(node.parent) && this.getIdMember(node.parent) !== undefined) {
                this.checkIfAllChildrenAreSelected(node.parent, nodeId, allChildren);
            }
        } else if (diff.length === 0) {
            this.partiallySelectedIds = removeLookupEntry(nodeId, this.partiallySelectedIds);
            this.selectedIds = addLookupEntry(nodeId, true, this.selectedIds);

            if (this.checkObject(node.parent) && this.getIdMember(node.parent) !== undefined) {
                this.checkIfAllChildrenAreSelected(node.parent, nodeId, allChildren);
            }
        } else {
            this.selectedIds = removeLookupEntry(nodeId, this.selectedIds);
            this.partiallySelectItem(node);
        }
    }

    private removeSelectedItems = (node: IFinalTreeNode) => {
        const selectedIds = this.checkRecursive(node);
        const keysToRemove = Object.keys(selectedIds);
        const oldKeys = Object.keys(this.selectedIds);
        const newSelected = _.without(oldKeys, ...keysToRemove);
        const newSelectedDict = {};
        for (let i = 0; i < newSelected.length; i++) {
            newSelectedDict[newSelected[i]] = true;
        }
        this.selectedIds = { ...newSelectedDict };

        if (this.checkObject(node.parent) && this.getIdMember(node.parent) !== undefined) {
            this.checkIfAllChildrenAreSelected(node.parent, this.getIdMember(node), selectedIds);
        }

        this.notifyWithSelectedNodes();
        this.notify();
    }

    private removeSelectedItem = (node: TreeNode) => {
        const nodeId = this.getIdMember(node);
        this.selectedIds = removeLookupEntry(nodeId, this.selectedIds);

        this.notifyWithSelectedNodes();
        this.notify();
    }

    private setSelectedItem = (node: TreeNode) => {
        const nodeId = this.getIdMember(node);
        this.selectedIds = addLookupEntry(nodeId, true, this.selectedIds);

        this.notifyWithSelectedNodes();
        this.notify();
    }

    private checkObject = (obj: any): boolean => {
        if (obj === undefined || obj === null) {
            return false;
        }
        return true;
    }

    private checkRecursive = (node: IFinalTreeNode, appendParentNode: boolean = true, skipItems: IDictionary<boolean> = {}) => {
        const selectedIds = {};
        this.recursiveChildSelection(selectedIds, node, appendParentNode, skipItems);
        return selectedIds;
    }

    /**
     * Return lookup table off all child ids
     */
    private recursiveChildSelection = (
        selectedIds: IDictionary<boolean>,
        node: IFinalTreeNode,
        appendParentNode: boolean = true,
        skipItems: IDictionary<boolean> = {}
    ): void => {
        if (appendParentNode) {
            const nodeId = this.getIdMember(node);
            selectedIds[nodeId] = true;
        }

        if (!this.itemHasChildren(node)) {
            return;
        }

        for (let child of node.children) {
            const childId = this.getIdMember(child);
            if (skipItems[childId]) {
                continue;
            }
            selectedIds[childId] = true;
            this.recursiveChildSelection(selectedIds, child, false, skipItems);
        }
    }

    private itemHasChildren = (item: TreeNode) => {
        if (!this.checkObject(item.children)) {
            return false;
        }
        return item.children.length !== 0;
    }

    private extendNodes(parent, children: Array<TreeNode>, level: number) {
        for (let node of children) {
            let extendedNode = <IFinalTreeNode>node;
            extendedNode.nodeId = this.getNextId();
            extendedNode.parent = parent;
            if (extendedNode.parent) {
                extendedNode.parentId = extendedNode.parent.nodeId;
            }
            extendedNode.nodeLevel = level;
            this.nodesById[extendedNode.nodeId] = extendedNode;
            if (node.children && node.children.length > 0) {
                this.extendNodes(node, node.children, level + 1);
            }
        }
    }

    private isDataSource(input: TreeNode | TreeDataSource | Array<any>): input is TreeDataSource {
        return (<TreeDataSource>input).updateNode !== undefined;
    }

    private isRootNodesArray(input: TreeNode | TreeDataSource | Array<any>): input is Array<any> {
        return (<Array<any>>input).slice !== undefined;
    }

    public updateNode<T>(nodeId: number, props: Partial<IFinalTreeNode & T>): TreeDataSource;
    public updateNode(nodeId: number, props: Partial<IFinalTreeNode>): TreeDataSource {
        let existingNode = this.nodesById[nodeId];
        if (existingNode) {

            // we do not want to use the spread operator, we want to reause the existing treenode            
            // existingNode = { ...existingNode, ...props };

            // if the children will be replaced, we need to remove the old ids
            if (props.children && existingNode.children && existingNode.children.length > 0) {
                const removeChildrenFromLookup = (node) => {
                    if (node && node.children) {
                        for (let i = 0; i < node.children.length; i++) {
                            delete this.nodesById[node.children[i].nodeId];
                            removeChildrenFromLookup(node.children[i]);
                        }
                    }
                };
                removeChildrenFromLookup(existingNode);
            }

            Object.assign(existingNode, props);

            if (props.children) {
                existingNode.isLazyChildrenLoadInProgress = false;
                existingNode.hasChildren = props.children && props.children.length > 0;
                existingNode.isExpanded = existingNode.isExpanded && existingNode.hasChildren;
                this.extendNodes(existingNode, existingNode.children, existingNode.nodeLevel + 1);

                if (this.selectedIds[nodeId] && this.enableRecursiveSelection) {
                    this.setSelected(existingNode);
                }
            }
            this.isEmpty = this.treeStructure.children.length === 0;
            return new TreeDataSource(this);
        }

        return this;
    }

    private getNextId(): number {
        return ++this.idCounter;
    }

    public getTreeStructure(): IFinalTreeNode {
        return this.treeStructure;
    }

    public getNodeById<T>(nodeId: number): IFinalTreeNode & T;
    public getNodeById(nodeId: number): IFinalTreeNode {
        return this.nodesById[nodeId];
    }

    public findNode<T>(nodePredicate: (node: IFinalTreeNode & T) => boolean): IFinalTreeNode & T;
    public findNode(nodePredicate: (node: IFinalTreeNode) => boolean): IFinalTreeNode {
        // tslint:disable-next-line:forin
        for (let key in this.nodesById) {
            let candidate = this.nodesById[key];
            if (nodePredicate(candidate)) {
                return candidate;
            }
        }
        return undefined;
    }
}
