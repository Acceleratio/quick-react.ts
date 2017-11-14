/* tslint:disable:no-bitwise */
import * as React from 'react';
import * as NumericInput from 'react-numeric-input';
import { IInnerSchedulerProps } from './InnerScheduler.Props';
import { TextField } from '../../TextField/TextField';
import { WeeklySchedule } from '../Scheduler.Props';
import { CheckboxList } from '../../CheckboxList/CheckboxList';
import { DaysOfWeekEnum } from '../../../index';

export class WeeklyScheduler extends React.PureComponent<IInnerSchedulerProps, any> {

    render() {
        let { recurrencePeriod, daysOfWeek } = this.props.schedule as WeeklySchedule;

        return (
            <div>
                <TextField
                    type="number"
                    value={recurrencePeriod.toString()}
                    onChange={this.onRecurrencePeriodChanged}
                />
                <CheckboxList
                    title={'Checkbox List'}
                    onCheckboxChanged={this.onCheckboxListChange}
                    items={[
                        { id: DaysOfWeekEnum.Sunday.toString(), text: 'Sunday', checked: Boolean(daysOfWeek & DaysOfWeekEnum.Sunday)},
                        { id: DaysOfWeekEnum.Monday.toString(), text: 'Monday', checked: Boolean(daysOfWeek & DaysOfWeekEnum.Monday) },
                        { id: DaysOfWeekEnum.Tuesday.toString(), text: 'Tuesday', checked: Boolean(daysOfWeek & DaysOfWeekEnum.Tuesday) },
                        { id: DaysOfWeekEnum.Wednesday.toString(), text: 'Wednesday', checked: Boolean(daysOfWeek & DaysOfWeekEnum.Wednesday) },
                        { id: DaysOfWeekEnum.Thursday.toString(), text: 'Thursday', checked: Boolean(daysOfWeek & DaysOfWeekEnum.Thursday) },
                        { id: DaysOfWeekEnum.Friday.toString(), text: 'Friday', checked: Boolean(daysOfWeek & DaysOfWeekEnum.Friday) },
                        { id: DaysOfWeekEnum.Saturday.toString(), text: 'Saturday', checked: Boolean(daysOfWeek & DaysOfWeekEnum.Saturday) }
                    ]}
                />
            </div>
        );
    }

    onRecurrencePeriodChanged = (e) => {
        const value = parseInt(e.target.value, 10);
        const newSchedule = {
            ...this.props.schedule,
            recurrencePeriod: value
        };
        this.props.onScheduleChanged(newSchedule);
    }

    onCheckboxListChange = (e, index: string, checked) => {
        const schedule = this.props.schedule as WeeklySchedule;
        const flipday = parseInt(index, 10);
        const newDaysOfWeek = schedule.daysOfWeek ^ flipday;
        const newSchedule = {
            ...this.props.schedule,
            daysOfWeek: newDaysOfWeek
        };
        this.props.onScheduleChanged(newSchedule);
    }
}

