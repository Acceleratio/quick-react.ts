/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TreeFilter, IFilterSelection, FilterSelectionEnum, VirtualizedTreeView } from '../../src/components/TreeFilter';
import { createFlatList, createRandomizedData, getSelectedIds } from '../MockData/treeFilterElements';
import { Button } from '../../src/components/Button/Button';

interface DemoState {
    filterStates: { [id: string]: IFilterSelection };
}
const treeData = createRandomizedData(2000, 2);
const deeperTreeData = createRandomizedData(50, 4);
const flatList = createFlatList(4000);
const selected = getSelectedIds(4000);
const shortFlatList = createFlatList(6);
export class Index extends React.Component<any, DemoState> {
    constructor(props) {
        super(props);
        this.state = {
            filterStates: {}
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

    public render() {

        return (
            <div style={{ paddingLeft: 300 }}>
                <TreeFilter
                    title="Tree Filter (max size)"
                    filterId={'f1'}
                    items={treeData}
                    onValuesSelected={this.onValuesSelected}
                    // tslint:disable-next-line:no-string-literal
                    filterSelection={this.state.filterStates['f1']}
                    defaultSelection={FilterSelectionEnum.All}
                    maxWidth={700}
                    maxHeight={500}
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
                    items={treeData}
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
