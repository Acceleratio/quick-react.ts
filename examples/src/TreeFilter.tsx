/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import { rebuildTree, updateTree, expandOrCollapseTreeItem, expandOrCollapseAsyncTreeItem } from '../../src/utilities/rebuildTree';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TreeFilter, IFilterSelection, FilterSelectionEnum, VirtualizedTreeView, TreeItem } from '../../src/components/TreeFilter';
import { createFlatList, createRandomizedData, getSelectedIds, createAsyncLoadRandomizedData, createCustomTooltipContentRandomizedData } from '../MockData/treeFilterElements';
import { Button } from '../../src/components/Button/Button';
import { ILookupTable } from '../../src/components/TreeFilter/TreeItemOperators';
import { Spinner } from '../../src/components/Spinner/Spinner';
import { SpinnerType } from '../../src/components/Spinner';

interface DemoState {
    filterStates: { [id: string]: IFilterSelection };    
    asyncTreeData: TreeItem[];
    treeData: TreeItem[];
}

const deeperTreeData = createRandomizedData(50, 4);
const flatList = createFlatList(4000);
const selected = getSelectedIds(4000);
const shortFlatList = createFlatList(6);
const customTooltipContent = createCustomTooltipContentRandomizedData();
export class Index extends React.Component<any, DemoState> {
    constructor(props) {
        super(props);
        const asyncTreeData = createAsyncLoadRandomizedData(1000, 4);
        this.state = {
            filterStates: {},            
            asyncTreeData: asyncTreeData,
            treeData: createRandomizedData(2000, 2)
        };
    }

    onValuesSelected = (filterId: string, filterSelection) => {
        console.log(filterId, filterSelection);
        let newFilters = { ...this.state };
        newFilters.filterStates[filterId] = filterSelection;
        this.setState(newFilters);
    }

    onSave = (filterId: string, filterSelection) => {
        let newFilters = { ...this.state };
        newFilters.filterStates[filterId] = filterSelection;
        this.setState(newFilters);
        console.log('Save clicked!', newFilters);
    }

    onAsyncTreeItemExpand = (treeItem: TreeItem, lookupTableGetter) => {        
        
        

        expandOrCollapseAsyncTreeItem(() => this.state.asyncTreeData,
         treeItem,
          lookupTableGetter, 
          (roots) => {
            this.setState({
                ...this.state,
                asyncTreeData: roots
            });

         },
        
          () => {
             return new Promise<TreeItem[]>((resolve) => {
                setTimeout(() => {
                    const randomNumber = (Math.random() * 100).toFixed(0);                    
                    const children = [{
                        id: treeItem.id + '-' + '1',
                        value: 'asyncly loaded ' + randomNumber,
                        expanded: false
                    }, {
                        id: treeItem.id + '-' + '2',
                        value: 'asyncly loaded 2',
                        expanded: false
                    }];

                    resolve(children);                            
                }, 3000);
             });
          }
        );        
    }

    private onItemExpand = (treeItem: TreeItem, lookupTableGetter) => {
        this.setState({
            ...this.state,
            treeData: expandOrCollapseTreeItem(this.state.treeData, treeItem, lookupTableGetter)
        });
    }

    public render() {

        return (
            <div style={{ paddingLeft: 300 }}>
                <TreeFilter
                    title="Tree Filter (max size)"
                    filterId={'f1'}
                    items={this.state.asyncTreeData}
                    onValuesSelected={this.onValuesSelected}
                    // tslint:disable-next-line:no-string-literal
                    filterSelection={this.state.filterStates['f1']}
                    defaultSelection={FilterSelectionEnum.All}
                    maxWidth={700}
                    maxHeight={500}
                    onItemExpand={this.onAsyncTreeItemExpand}
                    onCalloutClose={() => console.log('closing...')}
                />
                <br /><br />

                <TreeFilter
                    title="Tree Filter - depth 4"
                    disabled={true}
                    filterId={'f2'}
                    items={deeperTreeData}
                    onValuesSelected={this.onValuesSelected}
                    // tslint:disable-next-line:no-string-literal
                    filterSelection={this.state.filterStates['f2']}
                    defaultSelection={FilterSelectionEnum.All}
                />
                <br /><br />

                <TreeFilter
                    title="Single Select"
                    filterId={'f3'}
                    items={this.state.treeData}
                    onItemExpand={this.onItemExpand}
                    onValuesSelected={this.onValuesSelected}
                    isSingleSelect={true}
                    isGroupSelectableOnSingleSelect={true}
                    // tslint:disable-next-line:no-string-literal
                    filterSelection={this.state.filterStates['f3']}
                    defaultSelection={FilterSelectionEnum.All}
                    enabledResizeHandles={{
                        top: false,
                        right: false,
                        bottom: true,
                        left: true,
                        topRight: false,
                        bottomRight: false,
                        bottomLeft: true,
                        topLeft: false
                    }}
                />
                <br /><br />

                <TreeFilter
                    title="Flat list"
                    filterId={'f4'}
                    items={flatList}
                    onValuesSelected={this.onValuesSelected}
                    itemsAreFlatList={true}
                    // tslint:disable-next-line:no-string-literal
                    filterSelection={this.state.filterStates['f4']}
                    showStatusBar={false}
                />
                <br /><br />

                <TreeFilter
                    filterId={'f5'}
                    items={shortFlatList}
                    itemsAreFlatList={true}
                    defaultSelection={FilterSelectionEnum.All}
                    // tslint:disable-next-line:no-string-literal
                    filterSelection={this.state.filterStates['f5']}
                    showButtons={true}
                    onSave={this.onSave}
                />
                <br /><br />

                <TreeFilter
                    filterId={'f5'}
                    items={shortFlatList}
                    itemsAreFlatList={true}
                    defaultSelection={FilterSelectionEnum.All}
                    // tslint:disable-next-line:no-string-literal
                    filterSelection={this.state.filterStates['f5']}
                    hasTitleBorder={true}
                    showButtons={true}
                    onSave={this.onSave}
                />

                <br /><br />

                <TreeFilter
                    filterId={'f5'}
                    items={shortFlatList}
                    itemsAreFlatList={true}
                    defaultSelection={FilterSelectionEnum.All}
                    // tslint:disable-next-line:no-string-literal
                    filterSelection={this.state.filterStates['f5']}
                    hasTitleBorder={true}
                    showButtons={false}
                    onSave={this.onSave}
                />

                <br /><br />

                <TreeFilter
                    filterId={'f5'}
                    items={shortFlatList}
                    itemsAreFlatList={true}
                    defaultSelection={FilterSelectionEnum.All}
                    // tslint:disable-next-line:no-string-literal
                    filterSelection={this.state.filterStates['f5']}
                    hasTitleBorder={true}
                    showButtons={false}
                    hasSearch={false}
                    onSave={this.onSave}
                    showSelectAll={false}
                    emptySelectionText="Select role"
                    showStatusBar={false}
                    validated={false}
                />
                <br/><br/>
                <TreeFilter
                    title="Custom tooltip content Icon"
                    filterId={'f3'}
                    items={customTooltipContent}
                    onValuesSelected={this.onValuesSelected}
                    isSingleSelect={true}
                    isGroupSelectableOnSingleSelect={true}
                    // tslint:disable-next-line:no-string-literal
                    filterSelection={this.state.filterStates['f3']}
                    defaultSelection={FilterSelectionEnum.All}
                    enabledResizeHandles={{
                        top: false,
                        right: false,
                        bottom: true,
                        left: true,
                        topRight: false,
                        bottomRight: false,
                        bottomLeft: true,
                        topLeft: false
                    }}
                />
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
