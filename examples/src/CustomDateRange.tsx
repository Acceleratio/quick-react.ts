/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CustomDateRange } from './../../src/components/CustomDateRange/CustomDateRange';
import { Button } from '../../src/components/Button/Button';
import { autobind } from '../../src/index';
import * as moment from 'moment';

function _getTodayFilterDate(): any {
    const startDate = moment(new Date());
    const endDate = moment(new Date());
    startDate.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    });

    endDate.set({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999
    });

    const date = {
        startDate: startDate.toDate(),
        endDate: endDate.toDate()
    };
    return date;
}

export class Index extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            startDate: _getTodayFilterDate().startDate,
            endDate: _getTodayFilterDate().endDate,
            invalidDateRangeSelected: false,
            invalidErrorMessage: ''
        };
    }

    public render() {
        return (
            <div>
                <Button onClick={this.toggleDialog}>Open CustomDateRange Dialog</Button> <br /><br />

                <CustomDateRange
                    isDialogOpen={this.state.isOpen}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onSave={this.onSave}
                    onClose={this.toggleDialog}
                    onDateSelectionChanged={this.onDateSelectionChanged}
                    invalidDateRangeSelected={this.state.invalidDateRangeSelected}
                    invalidErrorMessage={this.state.invalidErrorMessage}>
                </CustomDateRange>
            </div>
        );
    }

    @autobind
    private toggleDialog() {
        this.setState({
            isOpen: !this.state.isOpen,
            invalidDateRangeSelected: false,
            invalidErrorMessage: ''
        });
    }

    @autobind
    private onDateSelectionChanged(selectedStartDate: Date, selectedEndDate: Date) {
        const invalidSelectedDate = moment(selectedStartDate) <= moment(selectedEndDate).subtract(3, 'day');
        this.setState({
            invalidDateRangeSelected: invalidSelectedDate,
            invalidErrorMessage: invalidSelectedDate ? 'The time period between Start and End date must not be more than 3 days.' : ''
        });
    }

    @autobind
    private onSave(startDate: Date, endDate: Date) {
        this.setState({ startDate: startDate, endDate: endDate });
        console.log('Save clicked!');
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
