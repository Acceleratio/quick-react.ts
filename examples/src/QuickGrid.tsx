import 'babel-polyfill';
import 'ts-helpers';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Resizable from 'react-resizable-box';
import { Dropdown, DropdownType } from '../../src/components/Dropdown';
import { Checkbox } from './../../src/components/Checkbox';
import { Button } from '../../src/components/Button';
import { QuickGrid, IQuickGridProps, SortDirection, GridColumn, QuickGridActions } from '../../src/components/QuickGrid';
import { gridColumns1, getTreeGridData, gridColumns2, getGridData, gridColumns3, getSmallGridData } from '../MockData/gridData';
import '../../src/components/TreeFilter/TreeFilter.scss'; // used for react-resizable style
import '../../src/components/Label/Label.scss';
import './../../src/components/Icon/symbol-defs.svg';
import { QuickGridActionsBehaviourEnum } from '../../src/index';

const numOfRows = 100000;



const columnSummaries = {
    Color: 'Best: Orange',
    Animal: 'Fastest: Dog',
    Numbers: 'Favorite: 7'
};

export class Index extends React.Component<any, any> {
    gridActions: QuickGridActions = {
        actionItems: [
            { name: 'Action 1', iconName: 'icon-add', commandName: 'command1' },
            { name: 'Action 2', iconName: 'icon-user', commandName: 'command2' },
            { name: 'Action 3', commandName: 'command3' },
            { name: 'Action 4', commandName: 'command4', parameters: { key: 'someParam' } }
        ],
        actionsBehaviour: QuickGridActionsBehaviourEnum.ShowOnRowHover,
        actionIconName: 'icon-ghost',
        onActionSelected: function (commandName: string, parameters, rowData) {
            // tslint:disable-next-line:no-console
            console.log(commandName, parameters, rowData);
            alert(commandName + ' clicked.');
        }
    };
    
    state = {
        data: getGridData(numOfRows),
        columns: gridColumns2,
        groupBy: [],
        selectedData: 1,
        gridActions: this.gridActions
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
                                { key: 1, text: '5 Columns' },
                                { key: 2, text: '2 Columns' }
                            ]}
                    />
                </div>
                <Checkbox label="Show as hover actions" 
                checked={this.state.gridActions.actionsBehaviour === QuickGridActionsBehaviourEnum.ShowOnRowHover} 
                onChange={this.onRowHoverActionsChecked } /> <br />
                <Button onClick={this.refreshData}>Refresh data</Button>

                <Resizable width={1000} height={700} >
                    <div className="viewport-height" style={{ height: '100%' }} >
                        <QuickGrid
                            rows={this.state.data.grid}
                            columns={this.state.columns}
                            groupBy={this.state.groupBy}
                            displayGroupContainer={true}
                            onGroupByChanged={this.groupByChanged}
                            gridActions={this.state.gridActions}
                            columnSummaries={columnSummaries}
                            actionsTooltip="Act on these."
                            tooltipsEnabled={true}
                        />
                    </div>
                </Resizable>
            </div >
        );
    }

    onRowHoverActionsChecked = (ev, value) => {        
        this.setState(prev => {
            const newBehaviour =  prev.gridActions.actionsBehaviour === QuickGridActionsBehaviourEnum.ShowAsFirstColumn  ? QuickGridActionsBehaviourEnum.ShowOnRowHover : QuickGridActionsBehaviourEnum.ShowAsFirstColumn;
            return { gridActions: {...prev.gridActions, actionsBehaviour: newBehaviour }};
        });
    }

    onDropdownDataChange = (option, index) => {
        if (option.key === 1) {
            this.setState({
                data: getGridData(numOfRows),
                columns: gridColumns2,
                selectedData: 1,
                groupBy: []
            });

        } else {
            this.setState({
                data: getSmallGridData(numOfRows),
                columns: gridColumns3,
                groupBy: [],
                selectedData: 2
            });
        }
    }

    refreshData = () => {
        const newData = getGridData(numOfRows);
        this.setState({ ...this.state, data: newData });
    }

    groupByChanged = (groupBy) => {
        // tslint:disable-next-line:no-console
        console.log(groupBy);
        this.setState((oldState) => ({ ...oldState, groupBy: groupBy }));
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
