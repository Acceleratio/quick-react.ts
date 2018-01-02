import 'babel-polyfill';
import 'ts-helpers';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Resizable from 'react-resizable-box';
import { Dropdown, DropdownType } from '../../src/components/Dropdown';
import { Button } from '../../src/components/Button';
import { QuickGrid, IQuickGridProps, SortDirection, GridColumn, QuickGridActions } from '../../src/components/QuickGrid';
import { gridColumns1, getTreeGridData, gridColumns2, getGridData } from '../MockData/gridData';
import '../../src/components/TreeFilter/TreeFilter.scss'; // used for react-resizable style
import '../../src/components/Label/Label.scss';

const numOfRows = 100000;


const gridActions: QuickGridActions = {
    actionItems: [
        { name: 'Action 1', iconName: 'icon-add', commandName: 'command1' },
        { name: 'Action 2', iconName: 'icon-user', commandName: 'command2' },
        { name: 'Action 3', commandName: 'command3' },
        { name: 'Action 4', commandName: 'command4', parameters: { key: 'someParam' } }
    ],
    actionIconName: 'icon-ghost',
    onActionSelected: function (commandName: string, parameters, rowData) {
        // tslint:disable-next-line:no-console
        console.log(commandName, parameters, rowData);
    }
};

const columnSummaries = {
    Name: 'Craziest: Vinko',
    Color: 'Best: Orange',
    Animal: 'Fastest: Dog',
    Numbers: 'Favorite: 7'
};

export class Index extends React.Component<any, any> {
    state = {
        data: getTreeGridData(),
        columns: gridColumns1,
        groupBy: [],
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
                                { key: 1, text: 'Tree Grid' },
                                { key: 2, text: 'Grid' }
                            ]}
                    />
                </div>
                <Button onClick={this.refreshData}>Refresh data</Button>

                <Resizable width={1000} height={700} >
                    <div className="viewport-height" style={{ height: '100%' }} >
                        <QuickGrid
                            rows={this.state.data.grid}
                            tree={this.state.data.tree}
                            columns={this.state.columns}
                            groupBy={this.state.groupBy}
                            displayGroupContainer={this.state.data.tree == null} // group by is hidden for tree grid
                            onGroupByChanged={this.groupByChanged}
                            gridActions={gridActions}
                            columnSummaries={columnSummaries}
                            actionsTooltip="Act on these."
                            tooltipsEnabled={true}
                        />
                    </div>
                </Resizable>
            </div >
        );
    }

    onDropdownDataChange = (option, index) => {
        if (option.key === 1) {
            this.setState({
                data: getTreeGridData(),
                columns: gridColumns1,
                selectedData: 1,
                groupBy: []
            });

        } else {
            this.setState({
                data: getGridData(numOfRows),
                columns: gridColumns2,
                groupBy: [],
                selectedData: 2
            });
        }
    }

    refreshData = () => {
        const newData = this.state.selectedData === 1 ? getTreeGridData() : getGridData(numOfRows);
        this.setState({ ...this.state, data: newData });
    }

    groupByChanged = (groupBy) => {
        // tslint:disable-next-line:no-console
        console.log(groupBy);
        this.setState((oldState) => ({ ...oldState, groupBy: groupBy }));
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
