/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DateTimePicker } from '../../src/components/DateTimePicker/DateTimePicker';
import { DateTimePickerBar } from '../../src/components/DateTimePickerBar/DateTimePickerBar';

export class Index extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(),
            date2: new Date()
        };
    }

    private setDate(newDate: Date, pickerId) {
        if (pickerId === 1) {
            this.setState({ date: newDate });
        } else {
            this.setState({ date2: newDate });
        }
    }

    public render() {
        return (
            <div>
                <DateTimePicker
                    is24HourFormat={false}
                    selectedDateTime={this.state.date}
                    includeTime={true}
                    onTimeSelectionChanged={(date) => this.setDate(date, 1)}
                    useKeyboardForTimeInput={true}
                />
                <DateTimePicker
                    is24HourFormat={true}
                    selectedDateTime={this.state.date2}
                    includeTime={true}
                    onTimeSelectionChanged={(date) => this.setDate(date, 2)}
                    useKeyboardForTimeInput={true}
                />
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
