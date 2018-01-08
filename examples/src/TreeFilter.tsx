/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import { rebuildTree, updateTree, expandOrCollapseTreeItem } from '../../src/utilities/rebuildTree';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TreeFilter, IFilterSelection, FilterSelectionEnum, VirtualizedTreeView, TreeItem } from '../../src/components/TreeFilter';
import { createFlatList, createRandomizedData, getSelectedIds, createAsyncLoadRandomizedData } from '../MockData/treeFilterElements';
import { Button } from '../../src/components/Button/Button';
import { ILookupTable } from '../../src/components/TreeFilter/TreeItemOperators';
import { Spinner } from '../../src/components/Spinner/Spinner';
import { SpinnerType } from '../../src/components/Spinner';

interface DemoState {
    filterStates: { [id: string]: IFilterSelection };
    asynclyLoadableItemIds: string[];
    asyncTreeData: TreeItem[];
    treeData: TreeItem[];
}

const deeperTreeData = createRandomizedData(50, 4);
const flatList = createFlatList(4000);
const selected = getSelectedIds(4000);
const shortFlatList = createFlatList(6);
export class Index extends React.Component<any, DemoState> {
    constructor(props) {
        super(props);
        const asyncTreeData = createAsyncLoadRandomizedData(1000, 4);
        this.state = {
            filterStates: {},
            asynclyLoadableItemIds: asyncTreeData[1],
            asyncTreeData: asyncTreeData[0],
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

        const index = this.state.asynclyLoadableItemIds.indexOf(treeItem.id);
        const isAsyncLoadItem = index > -1;
        const isNowExpanded = !treeItem.expanded;
        let expandedTreeItem = {
            ...treeItem,
            expanded: !treeItem.expanded
        };

        let newAsynclyLoadableItems = [...this.state.asynclyLoadableItemIds];
        if (isAsyncLoadItem) {
            newAsynclyLoadableItems.splice(index, 1);

            let loadingLabelTreeItem = {
                id: treeItem.id + '-1'  ,
                value: 'Loading...',
                expanded: false,
                children: [],
                renderElement: this.renderLoadingLabel
            };

            expandedTreeItem.children = [loadingLabelTreeItem];
        }

        this.setState({
            ...this.state,
            asyncTreeData: updateTree(this.state.asyncTreeData, expandedTreeItem, lookupTableGetter),
            asynclyLoadableItemIds: newAsynclyLoadableItems
        });

        if (!isAsyncLoadItem || !isNowExpanded) {
            return;
        }
        setTimeout(() => {
            const randomNumber = (Math.random() * 100).toFixed(0);
            const newTreeItem = {
                ...treeItem,
                expanded: !treeItem.expanded,
                children: [{
                    id: treeItem.id + '-' + '1',
                    value: 'asyncly loaded ' + randomNumber,
                    expanded: false
                }, {
                    id: treeItem.id + '-' + '2',
                    value: 'asyncly loaded 2',
                    expanded: false
                }]
            };

            const newTreeData = updateTree(this.state.asyncTreeData, newTreeItem, lookupTableGetter);
            this.setState({
                ...this.state,
                asyncTreeData: newTreeData
            });
        }, 1500);
    }

    private renderLoadingLabel(itemKey: string, style: any): JSX.Element {
        return (
            <div
                key={itemKey}
                className="item-container loading-container"
                style={style}
            >
                <Spinner className="tree-view-async-loading-spinner"
                    type={SpinnerType.small}
                />
                <span className="tree-view-async-loading-label">
                    Loading...
                </span>
            </div>
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
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
