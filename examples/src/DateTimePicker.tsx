/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DateTimePicker } from '../../src/components/DateTimePicker/DateTimePicker';
export class Index extends React.Component<any, any> {
    constructor() {
        super();

        this.state = {
            date: new Date()
        };
    }

    private setDate(newDate: Date) {
        this.setState({ date: newDate });
    }

    public render() {
        return (
            <div>
                <DateTimePicker 
                    is24HourFormat={false} 
                    selectedDateTime={this.state.date} 
                    onTimeSelectionChanged={(date) => this.setDate(date)}
                />
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
