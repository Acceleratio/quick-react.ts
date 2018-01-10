import 'babel-polyfill';
import 'ts-helpers';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Resizable from 'react-resizable-box';
import { Dropdown, DropdownType } from '../../src/components/Dropdown';
import { Button } from '../../src/components/Button';
import { TreeGrid, ITreeGridProps } from '../../src/components/TreeGrid';
import { SortDirection, GridColumn } from '../../src/components/QuickGrid';
import { gridColumns1, getTreeGridData } from '../MockData/gridData';
import '../../src/components/TreeFilter/TreeFilter.scss'; // used for react-resizable style
import '../../src/components/Label/Label.scss';


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
    
    public render() {
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
                            tree={this.state.data}
                            columns={this.state.columns}
                            columnSummaries={columnSummaries}
                        />
                    </div>
                </Resizable>
            </div >
        );
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
