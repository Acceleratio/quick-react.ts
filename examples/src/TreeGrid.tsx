// tslint:disable:no-console
import 'babel-polyfill';
import 'ts-helpers';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Resizable from 'react-resizable-box';
import { Dropdown, DropdownType } from '../../src/components/Dropdown';
import { Button } from '../../src/components/Button';
import { TreeGrid, ITreeGridProps } from '../../src/components/TreeGrid';
import { SortDirection, GridColumn, ActionItem } from '../../src/components/QuickGrid';
import { gridColumns1, getTreeGridData, generateTreeNode, nodeActions, GridData } from '../MockData/gridData';
import '../../src/components/TreeFilter/TreeFilter.scss'; // used for react-resizable style
import '../../src/components/Label/Label.scss';
import { updateTree, rebuildTree } from '../../src/utilities/rebuildTree';
import './../../src/components/Icon/symbol-defs.svg';
import { autobind, QuickGridActions, QuickGridActionsBehaviourEnum, Search, TreeDataSource, Label, Checkbox } from '../../src/index';
import { AugmentedTreeNode, TreeNode } from '../../src/models/TreeData';
import * as _ from 'lodash';

const columnSummaries = {
    Color: 'Best: Orange',
    Animal: 'Fastest: Dog',
    Numbers: 'Favorite: 7'
};

export class Index extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        const treeDataSource = getTreeGridData(0);

        this.state = {
            data: treeDataSource,
            columns: gridColumns1,
            selectedData: 1,
            searchText: '',
            selectedNode: 1,
            isSelectAll: false,
            enableRecursive: true
        };
    }

    gridActions: QuickGridActions = {
        actionItems: [],
        actionIconName: '',
        actionsBehaviour: QuickGridActionsBehaviourEnum.ShowOnRowHover,
        onActionSelected: this.rowActionClicked,
        onGetSingleRowContextActions: (node) => {

            // here we use the same node actions each time for demo purposes, but the actions can be per node
            return nodeActions;
        }
    };

    selectedDataListener = (selected: Array<AugmentedTreeNode>) => {
        console.log('selected nodes: ', selected);
    }

    selectedIdsListener = (selected: Array<string>) => {
        console.log('selected ids: ', selected);
    }

    rowActionClicked(commandName: string, parameters, rowData) {
        alert(commandName + ' clicked.');
    }

    searchQueryChanged = (value: string) => {
        this.setState(prev => ({
            searchText: value
        }));
    }

    scrollTo = (ev) => {
        let val = ev.target.value;
        if (ev.target.value.trim() === '') {
            val = 1;
        }

        this.setState({
            selectedNode: Number(val)
        });
    }

    onSelectedNodeChanged = (selectedNodes: Array<AugmentedTreeNode<GridData>>) => {
        console.log('selected node: ', selectedNodes);
    }

    changeSelectAll = () => {
        if (!this.state.isSelectAll) {
            this.state.data.selectAll();
        } else {
            this.state.data.deselectAll();
        }
        this.setState({ isSelectAll: !this.state.isSelectAll });
    }

    setSelectedItems = () => {
        this.state.data.setSelectedIds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }

    changeRecursiveSelection = () => {
        this.setState({ enableRecursive: !this.state.enableRecursive });
        this.state.data.setSelectedIds([]);
        this.state.data.setRecursiveSelection(!this.state.enableRecursive);
    }

    _listener = (items: Array<number | string>) => {
        console.log('changed: ', items);
    }

    getChildrenRecursive = () => {
        const data = getTreeGridData(1) as TreeDataSource;
        data.registerSelectedIdsListener(this._listener);
        data.selectAll();
    }

    prev: any;
    public render() {
        this.prev = this.state.data;
        return (
            <div>
                <Button onClick={this.getChildrenRecursive}>Click me!</Button>
                <div style={{ 'width': '150px' }}>
                    <Dropdown
                        hasTitleBorder={true}
                        dropdownType={DropdownType.selectionDropdown}
                        label="Data:"
                        onClick={this.onDropdownDataChange}
                        selectedKey={this.state.selectedData}
                        options={
                            [
                                { key: 1, text: 'Small Tree Grid' },
                                { key: 2, text: 'Large Tree Grid' }
                            ]}
                    />
                </div>
                <Button onClick={this.refreshData}>Refresh data</Button>
                <Label>Select item:</Label>
                <input type="number" onChange={this.scrollTo} />
                <div style={{ width: 250, paddingTop: 10 }}><Search value={this.state.searchText} labelText="Search nodes..." onChange={this.searchQueryChanged} /></div>
                <Checkbox label="Select all" checked={this.state.isSelectAll} onChange={this.changeSelectAll} />
                <Checkbox label="Enable recursive selection" checked={this.state.enableRecursive} onChange={this.changeRecursiveSelection} />
                <Button onClick={this.setSelectedItems}>Set selected items</Button>
                <Resizable width={1000} height={700} >
                    <div className="viewport-height" style={{ height: '100%' }} >
                        <TreeGrid
                            treeDataSource={this.state.data}
                            selectedNodeId={this.state.selectedNode}
                            columns={this.state.columns}
                            gridActions={this.gridActions}
                            onLazyLoadChildNodes={this.onLoadChildNodes}
                            columnSummaries={columnSummaries}
                            filterString={this.state.searchText}
                            onSelectedNodeChanged={this.onSelectedNodeChanged}
                            isMultiSelectable={true}
                        />
                    </div>
                </Resizable>
            </div >
        );
    }

    onLoadChildNodes = (node: AugmentedTreeNode<GridData>) => {   
        setTimeout(() => {
            let children = [];
            for (let i = 0; i < 6; i++) {
                let newChildNode = generateTreeNode();
                newChildNode.isExpanded = false;
                children.push(newChildNode);
            }
            let newData = this.state.data.updateNode(node.$meta.nodeId, { children });
            this.setState(prev => ({ data: newData }));
        }, 2000);
    }

    onDropdownDataChange = (option, index) => {
        if (option.key === 1) {
            this.setState({
                data: getTreeGridData(0),
                columns: gridColumns1,
                selectedData: 1,
                searchText: ''
            });

        } else {
            this.setState({
                data: getTreeGridData(1),
                columns: gridColumns1,
                selectedData: 2,
                searchText: ''
            });
        }
    }

    refreshData = () => {
        const newData = this.state.selectedData === 1 ? getTreeGridData(0) : getTreeGridData(1);
        this.setState({ ...this.state, data: newData, searchText: '' });
    }

}
ReactDOM.render(<Index />, document.getElementById('root'));
