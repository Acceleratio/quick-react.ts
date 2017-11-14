import * as React from 'react';
import * as NumericInput from 'react-numeric-input';
import { IInnerSchedulerProps } from './InnerScheduler.Props';
import { DailySchedule } from '../Scheduler.Props';
import { ChoiceGroup } from '../../ChoiceGroup/ChoiceGroup';
import { DaysOfWeekEnum, TextField } from '../../../index';

export class DailyScheduler extends React.PureComponent<IInnerSchedulerProps, any> {

    render() {
        let { recurrencePeriod, daysOfWeek } = this.props.schedule as DailySchedule;

        return (
            <div>
                <ChoiceGroup
                    options={[
                        { key: DailySheduleOptionEnum.EveryAmountOfDays.toString(), text: 'Every', checked: daysOfWeek === DaysOfWeekEnum.EveryDay },
                        { key: DailySheduleOptionEnum.EveryWeekday.toString(), text: 'Every weekday', checked: daysOfWeek === DaysOfWeekEnum.WorkDays }
                    ]}
                    onChanged={this.onChoiceGroupOptionChanged}

                />
                <div>
                    <TextField
                        type="number"
                        value={recurrencePeriod.toString()}
                        onClick={this.onRecurrencePeriodChanged}
                        onKeyUp={this.onRecurrencePeriodChanged}
                    />
                </div>
            </div>
        );
    }

    onRecurrencePeriodChanged = (e) => {
        const value = parseInt(e.target.value, 10);
        const newSchedule = {
            ...this.props.schedule,
            recurrencePeriod: value,
            daysOfWeek: DaysOfWeekEnum.EveryDay
        };
        this.props.onScheduleChanged(newSchedule);
    }

    onChoiceGroupOptionChanged = (value) => {
        let recurrencePeriod: number;
        let daysOfWeek: DaysOfWeekEnum;
        let newSchedule;
        if (value.key === DailySheduleOptionEnum.EveryAmountOfDays.toString()) {
            newSchedule = {
                ...this.props.schedule,
                daysOfWeek: DaysOfWeekEnum.EveryDay
            };
        } else {
            newSchedule = {
                ...this.props.schedule,
                daysOfWeek: DaysOfWeekEnum.WorkDays,
                recurrencePeriod: 1
            };
        }

        this.props.onScheduleChanged(newSchedule);
    }
}

export enum DailySheduleOptionEnum {
    EveryAmountOfDays,
    EveryWeekday
}
