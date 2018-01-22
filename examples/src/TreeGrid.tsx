import 'babel-polyfill';
import 'ts-helpers';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Resizable from 'react-resizable-box';
import { Dropdown, DropdownType } from '../../src/components/Dropdown';
import { Button } from '../../src/components/Button';
import { TreeGrid, ITreeGridProps } from '../../src/components/TreeGrid';
import { SortDirection, GridColumn } from '../../src/components/QuickGrid';
import { gridColumns1, getTreeGridData, generateTreeNode } from '../MockData/gridData';
import '../../src/components/TreeFilter/TreeFilter.scss'; // used for react-resizable style
import '../../src/components/Label/Label.scss';
import { updateTree, rebuildTree } from '../../src/utilities/rebuildTree';
import './../../src/components/Icon/symbol-defs.svg';
import { autobind } from '../../src/index';
import { IFinalTreeNode, TreeNode } from '../../src/models/TreeData';


const columnSummaries = {
    Color: 'Best: Orange',
    Animal: 'Fastest: Dog',
    Numbers: 'Favorite: 7'
};

export class Index extends React.Component<any, any> {
    state = {
        data: getTreeGridData(0),
        columns: gridColumns1,
        selectedData: 1
    };
    
    prev: any;
    public render() {        
        this.prev = this.state.data;
        return (
            <div>
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

                <Resizable width={1000} height={700} >
                    <div className="viewport-height" style={{ height: '100%' }} >
                        <TreeGrid
                            treeDataSource={this.state.data}
                            columns={this.state.columns}
                            onLoadChildNodes={this.onLoadChildNodes}
                            columnSummaries={columnSummaries}
                        />
                    </div>
                </Resizable>
            </div >
        );
    }

    onLoadChildNodes = (node: IFinalTreeNode) => {
        setTimeout(() => {
            let children = [];
            for (let i = 0; i < 6; i++) {
                let newChildNode = generateTreeNode();
                newChildNode.isExpanded = false;
                children.push(newChildNode);
            }
            let newData = this.state.data.updateNode(node.nodeId, { children });
            this.setState(prev => ({ data: newData }));
        }, 2000);
    }

    onDropdownDataChange = (option, index) => {
        if (option.key === 1) {
            this.setState({
                data: getTreeGridData(0),
                columns: gridColumns1,
                selectedData: 1
            });

        } else {
            this.setState({
                data: getTreeGridData(1),
                columns: gridColumns1,
                selectedData: 2
            });
        }
    }

    refreshData = () => {
        const newData = this.state.selectedData === 1 ? getTreeGridData(0) : getTreeGridData(1);
        this.setState({ ...this.state, data: newData });
    }

}
ReactDOM.render(<Index />, document.getElementById('root'));
