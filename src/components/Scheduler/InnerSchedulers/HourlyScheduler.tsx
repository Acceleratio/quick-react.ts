import * as React from 'react';
import * as NumericInput from 'react-numeric-input';
import { IInnerSchedulerProps } from './InnerScheduler.Props';
import { TextField } from '../../TextField/TextField';
import { HourlySchedule } from '../Scheduler.Props';

export class HourlyScheduler extends React.PureComponent<IInnerSchedulerProps, any> {

    render() {
        let { recurrencePeriod } = this.props.schedule as HourlySchedule;

        return (
            <div className="hourly-scheduler textField-container">
                <span> Every </span>
                <TextField
                    type="number"
                    min="1"
                    value={recurrencePeriod.toString()}
                    onChanged={this.onRecurrencePeriodChanged}
                />
                <span> hours </span>
            </div>
        );
    }

    onRecurrencePeriodChanged = (input) => {
        const value = parseInt(input, 10);
        let newSchedule = {
            ...this.props.schedule,
            recurrencePeriod: value
        };
        this.props.onScheduleChanged(newSchedule);
    }
}
