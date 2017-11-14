import * as React from 'react';
import * as NumericInput from 'react-numeric-input';
import { IInnerSchedulerProps } from './InnerScheduler.Props';
import { TextField } from '../../TextField/TextField';
import { MonthlySchedule } from '../Scheduler.Props';

export class MonthlyScheduler extends React.PureComponent<IInnerSchedulerProps, any> {

    render() {
        let { recurrencePeriod } = this.props.schedule as MonthlySchedule;

        return (
            <div>
                <NumericInput
                    value={recurrencePeriod}
                    onChange={this.onRecurrencePeriodChanged}
                />
            </div>
        );
    }

    onRecurrencePeriodChanged = (value) => {
        let newSchedule = {
            ...this.props.schedule,
            recurrencePeriod: value
        };
        this.props.onScheduleChanged(newSchedule);
    }
}


