import * as React from 'react';
import * as NumericInput from 'react-numeric-input';
import { IInnerSchedulerProps } from './InnerScheduler.Props';
import { TextField } from '../../TextField/TextField';
export class HourlyScheduler extends React.Component<IInnerSchedulerProps, {}> {

    render() {
        let { recurrencePeriod } = this.props.schedule;

        return (
            <div className="hourly-scheduler inner-scheduler">
                <div className="textField-container">
                    <span> Every </span>
                    <TextField
                        type="number"
                        min="1"
                        value={recurrencePeriod.toString()}
                        onChanged={this.onRecurrencePeriodChanged}
                    />
                    <span> hours </span>
                </div>
            </div>
        );
    }

    onRecurrencePeriodChanged = (input) => {
        const value = parseInt(input, 10);
        if (value === this.props.schedule.recurrencePeriod) {
            return;
        }

        let newSchedule = {
            ...this.props.schedule,
            recurrencePeriod: value
        };
        this.props.onScheduleChanged(newSchedule);
    }
}
