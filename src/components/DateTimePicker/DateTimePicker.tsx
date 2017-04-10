import * as React from 'react';
import * as classNames from 'classnames';
import DateTime = require('react-datetime');
import { TimePicker } from './timePicker';
import './Vendor.scss';
import './DateTimePicker.scss';
import { autobind } from '../../utilities/autobind';

import * as moment from 'moment';

export interface IDateTimePickerProps {
    selectedDateTime: Date;
    is24HourFormat: boolean;
    onTimeSelectionChanged: (selectedDateTime: Date) => void;
}

export class DateTimePicker extends React.Component<IDateTimePickerProps, void> {

    @autobind
    onDatePickerChanged(dt) {        
        let date = moment(dt).toDate();
        date.setSeconds(0);
        date.setMilliseconds(0);
        this.props.onTimeSelectionChanged(date);
    }

    @autobind
    onTimePickerChanged(hour: number, minute: number) {
        let selectedDateTime = new Date(this.props.selectedDateTime.getTime());
        selectedDateTime.setHours(hour);
        selectedDateTime.setMinutes(minute);
        selectedDateTime.setMilliseconds(0);
        selectedDateTime.setSeconds(0);
        this.props.onTimeSelectionChanged(selectedDateTime);
    }

    public render(): JSX.Element {
        let hour = this.props.selectedDateTime.getHours();
        let minute = this.props.selectedDateTime.getMinutes();

        return (
            <div className="date-time-picker">
                <DateTime input={false} value={this.props.selectedDateTime} timeFormat={false} onChange={this.onDatePickerChanged} />
                <TimePicker hour={hour} minute={minute} is24Hour={this.props.is24HourFormat} onTimeChanged={this.onTimePickerChanged} />
            </div>
        );
    }
}
