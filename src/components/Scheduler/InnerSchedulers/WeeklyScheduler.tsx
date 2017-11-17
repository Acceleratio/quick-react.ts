/* tslint:disable:no-bitwise */
import * as React from 'react';
import * as NumericInput from 'react-numeric-input';
import { IInnerSchedulerProps } from './InnerScheduler.Props';
import { TextField } from '../../TextField/TextField';
import { CheckboxList } from '../../CheckboxList/CheckboxList';
import { DaysOfWeekEnum } from '../../../index';

export class WeeklyScheduler extends React.Component<IInnerSchedulerProps, {}> {

    render() {
        let { recurrencePeriod, daysOfWeek } = this.props.schedule;

        return (
            <div className="weekly-scheduler inner-scheduler">
                <div className="textField-container">
                    <span> Recur every </span>
                    <TextField
                        type="number"
                        min="1"
                        value={recurrencePeriod.toString()}
                        onChanged={this.onRecurrencePeriodChanged}
                    />
                    <span> minutes on: </span>
                </div>
                <CheckboxList
                    onCheckboxChanged={this.onCheckboxListChange}
                    items={this.getWeeklyCheckboxListItems(daysOfWeek)}
                />
            </div>
        );
    }

    onRecurrencePeriodChanged = (input) => {
        const value = parseInt(input, 10);
        if (value === this.props.schedule.recurrencePeriod) {
            return;
        }

        const newSchedule = {
            ...this.props.schedule,
            recurrencePeriod: value
        };
        this.props.onScheduleChanged(newSchedule);
    }

    onCheckboxListChange = (e, index: string, checked: boolean) => {
        const schedule = this.props.schedule;
        const dayToFlip = parseInt(index, 10);
        const newDaysOfWeek = schedule.daysOfWeek ^ dayToFlip;
        const newSchedule = {
            ...this.props.schedule,
            daysOfWeek: newDaysOfWeek
        };
        this.props.onScheduleChanged(newSchedule);
    }

    getWeeklyCheckboxListItems = (daysOfWeek) => {
        return [
            {
                id: DaysOfWeekEnum.Sunday.toString(),
                text: 'Sunday',
                checked: Boolean(daysOfWeek & DaysOfWeekEnum.Sunday)
            },
            {
                id: DaysOfWeekEnum.Monday.toString(),
                text: 'Monday',
                checked: Boolean(daysOfWeek & DaysOfWeekEnum.Monday)
            },
            {
                id: DaysOfWeekEnum.Tuesday.toString(),
                text: 'Tuesday',
                checked: Boolean(daysOfWeek & DaysOfWeekEnum.Tuesday)
            },
            {
                id: DaysOfWeekEnum.Wednesday.toString(),
                text: 'Wednesday',
                checked: Boolean(daysOfWeek & DaysOfWeekEnum.Wednesday)
            },
            {
                id: DaysOfWeekEnum.Thursday.toString(),
                text: 'Thursday',
                checked: Boolean(daysOfWeek & DaysOfWeekEnum.Thursday)
            },
            {
                id: DaysOfWeekEnum.Friday.toString(),
                text: 'Friday',
                checked: Boolean(daysOfWeek & DaysOfWeekEnum.Friday)
            },
            {
                id: DaysOfWeekEnum.Saturday.toString(),
                text: 'Saturday',
                checked: Boolean(daysOfWeek & DaysOfWeekEnum.Saturday)
            }
        ];
    }
}
