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
    className?: string;
}

export type AugmentedTreeNode<T = {}> = TreeNode & T & {

    $meta: {
        nodeId?: any; // number | string;
        parentNodeId?: any; // nodeId of the parent node
        nodeLevel: number;
        sortRequestId?: number;
        isLazyChildrenLoadInProgress?: boolean;
        isAsyncLoadingDummyNode?: boolean;
        satisfiesFilterCondition?: boolean;
        descendantSatisfiesFilterCondition?: boolean;
    };

    children?: Array<AugmentedTreeNode<T>>;
    parentNode: AugmentedTreeNode<T>;
};

export interface ITreeStructureRoot<T> {
    children?: Array<AugmentedTreeNode<T>>;
}

export interface ILookupTable {
    [id: number]: AugmentedTreeNode;
    [id: string]: AugmentedTreeNode;
}

export type IdGetter = (node: TreeNode) => string | number;

export type SelectedIdListener = (selectedIds: Array<string>) => void;

export type DataListener = (selectedIds: Array<AugmentedTreeNode>) => void;

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
export class TreeDataSource<T = {}> implements IObservable<React.Component> {
    private idCounter: number = 0;

    // this would constitute a really dirty hack
    // React shallow compares each prop that is an object before even calling ShouldComponentUpdate    
    // To force react to event consider updating a component(event if it is not pure) we need to pass an object that has some change
    // Since we are copying everything from the previous iteration we need at least one field that actually changes    
    private changeIteration: number = 0;
    private treeStructure: AugmentedTreeNode<T>;
    private idMember: string | IdGetter;
    private renumberIds: boolean;
    public isEmpty: boolean;

    /** Lookup that holds parent object for given node */
    // private parentLookup: ILookupTable;

    /** Lookup that returns node object for given node id */
    private nodesById: ILookupTable;

    /**
     * 
     * @param input warning: will be mutated and returned as ITreeDataSource
     * @param idMember the field that contains the id of the node, or a function that returns a unique id for a node.
     * If no parameter is supplied ids will be generated automatically
     */
    constructor(
        input: TreeNode | TreeDataSource | Array<any>,
        idMember?: (string | IdGetter),
        enableRecursiveSelection: boolean = true,
        selectedNodes: Array<number | string> = []
    ) {
        this.updateSelectStrategy(enableRecursiveSelection);
        this.partiallySelectedIds = {};
        this.selectedIds = {};

        if (this.isDataSource(input)) {
            this.nodesById = input.nodesById;
            this.idCounter = input.idCounter;
            this.treeStructure = <AugmentedTreeNode<T>>input.treeStructure;
            this.changeIteration = input.changeIteration + 1;
            this.idMember = input.idMember || idMember;
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
            this.idMember = idMember;
            this.treeStructure = <AugmentedTreeNode<T>>rootNode;
            if (!this.treeStructure.$meta) {
                this.treeStructure.$meta = {
                    nodeLevel: -1
                };
            }

            this.renumberIds = true;
            this.extendNodes(rootNode, rootNode.children);
            this.renumberIds = false;
            this.isEmpty = this.treeStructure.children.length === 0;
            this.setSelectedIds(selectedNodes);
        }
    }

    private itemHasChildren = (item: TreeNode) => {
        if (!this.checkObject(item.children)) {
            return false;
        }
        return item.children.length !== 0;
    }

    private extendNodes(parent, children: Array<TreeNode>) {
        for (let node of children) {
            this.extendSingleNode(node, parent);
        }
    }

    private extendSingleNode(node: TreeNode, parent: AugmentedTreeNode<T>) {
        let extendedNode = <AugmentedTreeNode>node;
        let level = parent && parent.$meta ? parent.$meta.nodeLevel + 1 : 0;
        extendedNode.$meta = {
            nodeId: this.getNodeId(extendedNode),
            parentNodeId: parent && parent.$meta && parent.$meta.nodeLevel !== -1 ? parent.$meta.nodeId : undefined,
            nodeLevel: level
        };
        extendedNode.parentNode = parent && parent.$meta && parent.$meta.nodeLevel !== -1 ? parent : undefined;
        this.nodesById[extendedNode.$meta.nodeId] = extendedNode;
        if (node.children && node.children.length > 0) {
            this.extendNodes(node, node.children);
        }
    }

    private getNodeId(node: any) {
        if (node.$meta && node.$meta.nodeId && !this.renumberIds) {
            return node.$meta.nodeId;
        }
        if (!this.idMember) {
            return this.getNextSurogateId();
        }
        if (this.idMember instanceof Function) {
            return this.idMember(node);
        }
        if (!node.hasOwnProperty(this.idMember)) {
            throw Error('Object doesn\'t have specified property for given key.');
        }
        return node[this.idMember];
    }

    private isDataSource(input: TreeNode | TreeDataSource | Array<any>): input is TreeDataSource {
        return (<TreeDataSource>input).updateNode !== undefined;
    }

    private isRootNodesArray(input: TreeNode | TreeDataSource | Array<any>): input is Array<any> {
        return (<Array<any>>input).slice !== undefined;
    }

    public appendNode(node: T, parentNodeId?: number | string): TreeDataSource<T> {
        const parentNode = this.getNodeById(parentNodeId);
        this.extendSingleNode(node, parentNode);
        if (parentNode) {
            parentNode.children.push(node);
        } else {
            this.treeStructure.children.push(node);
        }

        return new TreeDataSource<T>(this);
    }

    public updateNode<NodeType = T>(nodeId: number | string, props: Partial<AugmentedTreeNode<NodeType>> | Partial<NodeType> & { children?: any }): TreeDataSource<T> {
        let existingNode = this.nodesById[nodeId];
        if (existingNode) {

            // we do not want to use the spread operator, we want to reause the existing treenode            
            // existingNode = { ...existingNode, ...props };

            // if the children will be replaced, we need to remove the old ids
            if (props.children && existingNode.children && existingNode.children.length > 0) {
                const removeChildrenFromLookup = (node: AugmentedTreeNode) => {
                    if (node && node.children) {
                        for (let i = 0; i < node.children.length; i++) {
                            delete this.nodesById[node.children[i].$meta.nodeId];
                            removeChildrenFromLookup(node.children[i]);
                        }
                    }
                };
                removeChildrenFromLookup(existingNode);
            }

            let originalMeta = existingNode.$meta;
            let newMeta = (<any>props).$meta;
            Object.assign(existingNode, props);
            if (originalMeta && newMeta) {
                existingNode.$meta = Object.assign(originalMeta, newMeta);
            }

            if (props.children) {
                existingNode.$meta.isLazyChildrenLoadInProgress = false;
                existingNode.hasChildren = props.children && props.children.length > 0;
                existingNode.isExpanded = existingNode.isExpanded && existingNode.hasChildren;

                this.extendNodes(existingNode, existingNode.children);
                if (this.selectedIds[nodeId] && this.enableRecursiveSelection) {
                    this.setSelected(existingNode);
                }
            }
            this.isEmpty = this.treeStructure.children.length === 0;
            return new TreeDataSource(this);
        }

        return this;
    }

    private getNextSurogateId(): number {
        return ++this.idCounter;
    }

    public getTreeStructure(): ITreeStructureRoot<T> {
        return <ITreeStructureRoot<T>>this.treeStructure;
    }

    public getNodeById<NodeType = T>(nodeId: number | string): AugmentedTreeNode<NodeType> {
        return this.nodesById[nodeId] as AugmentedTreeNode<NodeType>;
    }

    public findNode<NodeType = T>(nodePredicate: (node: AugmentedTreeNode<NodeType>) => boolean): AugmentedTreeNode<NodeType> {
        // tslint:disable-next-line:forin
        for (let key in this.nodesById) {
            let candidate = <AugmentedTreeNode<NodeType>>this.nodesById[key];
            if (nodePredicate(candidate)) {
                return candidate;
            }
        }
        return undefined;
    }


    private subscribers: Array<React.Component> = [];
    private dataListeners: Array<DataListener> = [];
    private selectedIdsListeners: Array<SelectedIdListener> = [];

    public enableRecursiveSelection: boolean;

    // items used for row selection
    private selectedIds: IDictionary<boolean>;
    private partiallySelectedIds: IDictionary<boolean>;

    private _selectItemsStrategy: (item: AugmentedTreeNode) => void;
    private _removeItemsStrategy: (item: AugmentedTreeNode) => void;

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
        const nodes = selectedIds.map(id => this.nodesById[id] as AugmentedTreeNode);
        this.dataListeners.forEach(dataListener => dataListener(nodes));
    }

    public setRecursiveSelection(isEnabled: boolean) {
        this.enableRecursiveSelection = isEnabled;
        this.updateSelectStrategy(isEnabled);
    }

    public notify = () => this.subscribers.forEach(l => l.forceUpdate());

    get SelectedNodes(): IDictionary<boolean> {
        return this.selectedIds;
    }

    get PartiallySelectedNodes(): IDictionary<boolean> {
        return this.partiallySelectedIds;
    }

    get NodesById(): ILookupTable {
        return this.nodesById;
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

    public setSelected(item: AugmentedTreeNode) {
        this._selectItemsStrategy(item);
    }

    public removeSelected(item: AugmentedTreeNode) {
        this._removeItemsStrategy(item);
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

    private updateSelectedItems = (node: AugmentedTreeNode) => {
        // get all selected items from this node up to all children
        const selectedIds = this.checkRecursive(node);

        // merge old selected items and new selected items
        this.selectedIds = { ...this.selectedIds, ...selectedIds };

        const nodeId = this.getNodeId(node);

        // if it was partially selected before, remove it from partial selection
        if (this.partiallySelectedIds.hasOwnProperty(nodeId)) {
            this.partiallySelectedIds = removeLookupEntry(nodeId, this.partiallySelectedIds);
        }

        if (this.checkObject(node.parentNode) && this.getNodeId(node.parentNode) !== undefined) {
            this.checkIfAllChildrenAreSelected(node.parentNode, nodeId, selectedIds);
        }

        this.notifyWithSelectedNodes();
        this.notify();
    }

    private partiallySelectItem = (node: AugmentedTreeNode) => {
        const nodeId = this.getNodeId(node);
        this.selectedIds = removeLookupEntry(nodeId, this.selectedIds);
        this.partiallySelectedIds = addLookupEntry(nodeId, true, this.partiallySelectedIds);

        if (!this.checkObject(node.parentNode)) {
            return;
        }

        this.partiallySelectItem(node.parentNode);
    }

    private checkIfAllChildrenAreSelected = (
        node: AugmentedTreeNode,
        childNodeId: number | string,
        nodeChildrenSubset: IDictionary<boolean>
    ) => {
        const nodeId = this.getNodeId(node);
        const allChildren = { ...this.checkRecursive(node, false, { [childNodeId]: true }), ...nodeChildrenSubset };
        const allChildrenKeys = Object.keys(allChildren);
        const allSelectedItemKeys = Object.keys(this.selectedIds);
        const diff = _.difference(allChildrenKeys, allSelectedItemKeys);

        if (diff.length === allChildrenKeys.length) {
            this.partiallySelectedIds = removeLookupEntry(nodeId, this.partiallySelectedIds);
            this.selectedIds = removeLookupEntry(nodeId, this.selectedIds);
            if (this.checkObject(node.parentNode) && this.getNodeId(node.parentNode) !== undefined) {
                this.checkIfAllChildrenAreSelected(node.parentNode, nodeId, allChildren);
            }
        } else if (diff.length === 0) {
            this.partiallySelectedIds = removeLookupEntry(nodeId, this.partiallySelectedIds);
            this.selectedIds = addLookupEntry(nodeId, true, this.selectedIds);

            if (this.checkObject(node.parentNode) && this.getNodeId(node.parentNode) !== undefined) {
                this.checkIfAllChildrenAreSelected(node.parentNode, nodeId, allChildren);
            }
        } else {
            this.selectedIds = removeLookupEntry(nodeId, this.selectedIds);
            this.partiallySelectItem(node);
        }
    }

    private removeSelectedItems = (node: AugmentedTreeNode) => {
        const selectedIds = this.checkRecursive(node);
        const keysToRemove = Object.keys(selectedIds);
        const oldKeys = Object.keys(this.selectedIds);
        const newSelected = _.without(oldKeys, ...keysToRemove);
        const newSelectedDict = {};
        for (let i = 0; i < newSelected.length; i++) {
            newSelectedDict[newSelected[i]] = true;
        }
        this.selectedIds = { ...newSelectedDict };

        if (this.checkObject(node.parentNode) && this.getNodeId(node.parentNode) !== undefined) {
            this.checkIfAllChildrenAreSelected(node.parentNode, this.getNodeId(node), selectedIds);
        }

        this.notifyWithSelectedNodes();
        this.notify();
    }

    private removeSelectedItem = (node: TreeNode) => {
        const nodeId = this.getNodeId(node);
        this.selectedIds = removeLookupEntry(nodeId, this.selectedIds);

        this.notifyWithSelectedNodes();
        this.notify();
    }

    private setSelectedItem = (node: TreeNode) => {
        const nodeId = this.getNodeId(node);
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

    private checkRecursive = (node: AugmentedTreeNode, appendParentNode: boolean = true, skipItems: IDictionary<boolean> = {}) => {
        const selectedIds = {};
        this.recursiveChildSelection(selectedIds, node, appendParentNode, skipItems);
        return selectedIds;
    }

    /**
     * Return lookup table off all child ids
     */
    private recursiveChildSelection = (
        selectedIds: IDictionary<boolean>,
        node: AugmentedTreeNode,
        appendParentNode: boolean = true,
        skipItems: IDictionary<boolean> = {}
    ): void => {
        if (appendParentNode) {
            const nodeId = this.getNodeId(node);
            selectedIds[nodeId] = true;
            if (this.partiallySelectedIds.hasOwnProperty(nodeId)) {
                this.partiallySelectedIds = removeLookupEntry(nodeId, this.partiallySelectedIds);
            }
        }

        if (!this.itemHasChildren(node)) {
            return;
        }

        for (let child of node.children) {
            let augmentedChild = child as AugmentedTreeNode;
            const childId = this.getNodeId(child);
            if (skipItems[childId]) {
                continue;
            }
            selectedIds[childId] = true;
            if (this.partiallySelectedIds.hasOwnProperty(childId)) {
                this.partiallySelectedIds = removeLookupEntry(childId, this.partiallySelectedIds);
            }
            this.recursiveChildSelection(selectedIds, child as AugmentedTreeNode, false, skipItems);
        }
    }

}
