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
        parentNodeId?: number | string; // nodeId of the parent node
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
export class TreeDataSource<T = {}> {
    public nodesById: ILookupTable;
    private idCounter: number = 0;
    // this would constitute a really dirty hack
    // React shallow compares each prop that is an object before even calling ShouldComponentUpdate    
    // To force react to event consider updating a component(event if it is not pure) we need to pass an object that has some change
    // Since we are copying everything from the previous iteration we need at least one field that actually changes    
    private changeIteration: number = 0;
    private treeStructure: AugmentedTreeNode<T>;
    private idMember: string | ((arg: TreeNode) => string | number);
    private renumberIds: boolean;
    public isEmpty: boolean;
    /**
     * 
     * @param input warning: will be mutated and returned as ITreeDataSource
     * @param idMember the field that contains the id of the node, or a function that returns a unique id for a node.
     * If no parameter is supplied ids will be generated automatically
     */
    constructor(input: TreeNode | TreeDataSource | Array<any>, idMember?: string | ((node: any) => string | number)) {

        if (this.isDataSource(input)) {
            this.nodesById = input.nodesById;
            this.idCounter = input.idCounter;
            this.treeStructure = <AugmentedTreeNode<T>>input.treeStructure;
            this.changeIteration = input.changeIteration + 1;
            this.idMember = input.idMember || idMember;
            
        } else {
            let rootNode: TreeNode;
            if (this.isRootNodesArray(input)) {
                rootNode = { children: input };
            } else {
                rootNode = input;
            }
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

        }
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
}
