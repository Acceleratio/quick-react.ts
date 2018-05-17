export interface TreeNode { // extend this interface on a data structure to be used for row data    
    isExpanded?: boolean;
    children?: Array<TreeNode>;
    hasChildren?: boolean;
    iconName?: string;
    iconTooltipContent?: string;
    iconClassName?: string;
    className?: string;
}

export type IExtendedTreeNode<T = any > = TreeNode & T & {
    
    $meta: {
        nodeId?: number | string;
        parentNodeId?: number | string; // nodeId of the parent node
        nodeLevel: number;
        sortRequestId?: number;
        isLazyChildrenLoadInProgress?: boolean;
        isAsyncLoadingDummyNode?: boolean;
        satisfiesFilterCondition?: boolean;
        descendantSatisfiesFilterCondition?: boolean;
    };
    
    children?: Array<IExtendedTreeNode<T>>;
    parentNode: IExtendedTreeNode<T>;
};

export interface ILookupTable {
    [id: number]: IExtendedTreeNode;
    [id: string]: IExtendedTreeNode;
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
export class TreeDataSource<T = any> {
    public nodesById: ILookupTable;
    private idCounter: number = 0;
    // this would constitute a really dirty hack
    // React shallow compares each prop that is an object before even calling ShouldComponentUpdate    
    // To force react to event consider updating a component(event if it is not pure) we need to pass an object that has some change
    // Since we are copying everything from the previous iteration we need at least one field that actually changes    
    private changeIteration: number = 0;
    private treeStructure: IExtendedTreeNode;
    private idMember:  string | ((arg: TreeNode) => string | number);
    
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
            this.treeStructure = input.treeStructure;
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
            this.treeStructure = <IExtendedTreeNode>rootNode;
            if (!this.treeStructure.$meta) {
                this.treeStructure.$meta = {
                    nodeLevel: -1
                };
            }
            this.extendNodes(input, rootNode.children, 0);
            this.isEmpty = this.treeStructure.children.length === 0;
            
        }
    }

    private extendNodes(parent, children: Array<TreeNode>, level: number) {
        for (let node of children) {
            let extendedNode = <IExtendedTreeNode>node;
            extendedNode.$meta = {
                nodeId: this.getNodeId(extendedNode),
                parentNodeId: parent ? parent.$meta.nodeId : undefined,
                nodeLevel: level
            };
            extendedNode.parentNode = parent;
            this.nodesById[extendedNode.$meta.nodeId] = extendedNode;
            if (node.children && node.children.length > 0) {
                this.extendNodes(node, node.children, level + 1);
            }
        }
    }

    private getNodeId(node: any) {
        if (node.$meta && node.$meta.nodeId) {
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

    public updateNode<NodeType = T>(nodeId: number | string, props: Partial<IExtendedTreeNode<NodeType>>): TreeDataSource<T> {
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
                existingNode.$meta.isLazyChildrenLoadInProgress = false;
                existingNode.hasChildren = props.children && props.children.length > 0;
                existingNode.isExpanded = existingNode.isExpanded && existingNode.hasChildren;
                this.extendNodes(existingNode, existingNode.children, existingNode.$meta.nodeLevel + 1);
            }
            this.isEmpty = this.treeStructure.children.length === 0;
            return new TreeDataSource(this);
        }
        return this;
    }

    private getNextSurogateId(): number {
        return ++this.idCounter;
    }

    public getTreeStructure(): IExtendedTreeNode {
        return this.treeStructure;
    }

    public getNodeById<NodeType = T>(nodeId: number | string): IExtendedTreeNode<NodeType> {
        return this.nodesById[nodeId] as IExtendedTreeNode<NodeType>;
    }

    public findNode<NodeType = T>(nodePredicate: (node: IExtendedTreeNode<NodeType>) => boolean): IExtendedTreeNode<NodeType> {
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
