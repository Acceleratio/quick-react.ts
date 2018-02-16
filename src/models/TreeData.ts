export interface TreeNode { // extend this interface on a data structure to be used for row data    
    isExpanded?: boolean;
    children?: Array<TreeNode>;
    hasChildren?: boolean;
    iconName?: string;
    iconTooltipContent?: string;
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
    isVisible?: boolean;
}

interface ILookupTable {
    [id: number]: IFinalTreeNode;
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
export class TreeDataSource {
    private nodesById: ILookupTable;
    private idCounter: number = 0;
    // this would constitute a really dirty hack
    // React shallow compares each prop that is an object before even calling ShouldComponentUpdate    
    // To force react to event consider updating a component(event if it is not pure) we need to pass an object that has some change
    // Since we are copying everything from the previous iteration we need at least one field that actually changes    
    private changeIteration: number = 0;
    private treeStructure: IFinalTreeNode;
    public isEmpty: boolean;
    /**
     * 
     * @param root warning: will be mutated and returned as ITreeDataSource
     */
    constructor(input: TreeNode | TreeDataSource | Array<any>) {
        if (this.isDataSource(input)) {
            this.nodesById = input.nodesById;
            this.idCounter = input.idCounter;
            this.treeStructure = input.treeStructure;
            this.changeIteration = input.changeIteration + 1;
        } else {
            let rootNode: TreeNode;
            if (this.isRootNodesArray(input)) {
                rootNode = { children: input };
            } else {
                rootNode = input;
            }
            this.nodesById = {};
            this.extendNodes(input, rootNode.children, 0);
            this.treeStructure = <IFinalTreeNode>rootNode;
            this.isEmpty = this.treeStructure.children.length === 0;
        }
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

    private isRootNodesArray(input: TreeNode | TreeDataSource| Array<any>): input is Array<any> {
        return (<Array<any>>input).slice !== undefined;
    }

    public updateNode<T>(nodeId: number, props: Partial<IFinalTreeNode & T>): TreeDataSource;    
    public updateNode(nodeId: number, props: Partial<IFinalTreeNode>): TreeDataSource {
        let existingNode = this.nodesById[nodeId];
        if (existingNode) {

            // we do not want to use the spread operator, we want to reause the existing treenode            
            // existingNode = { ...existingNode, ...props };
            Object.assign(existingNode, props);

            if (props.children) {
                existingNode.isLazyChildrenLoadInProgress = false;
                existingNode.hasChildren = props.children && props.children.length > 0;
                existingNode.isExpanded = existingNode.isExpanded && existingNode.hasChildren;
                this.extendNodes(existingNode, existingNode.children, existingNode.nodeLevel + 1);
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
