import * as React from 'react';
import * as NumericInput from 'react-numeric-input';
import { IInnerSchedulerProps, DailySheduleOptionEnum } from './InnerScheduler.Props';
import { ChoiceGroup } from '../../ChoiceGroup/ChoiceGroup';
import { DaysOfWeekEnum, TextField } from '../../../index';

export class DailyScheduler extends React.Component<IInnerSchedulerProps, {}> {

    render() {
        let { recurrencePeriod, daysOfWeek } = this.props.schedule;
        const choiceOptionText: any = (
            <div className="choice-item-content">
                <span>Every</span>
                <TextField
                    type="number"
                    min="1"
                    value={recurrencePeriod.toString()}
                    onChanged={this.onRecurrencePeriodChanged}
                />
                <span>day(s)</span>
            </div>
        );

        return (
            <div className="daily-scheduler inner-scheduler">
                <ChoiceGroup
                    options={[
                        {
                            key: DailySheduleOptionEnum.EveryAmountOfDays.toString(),
                            text: choiceOptionText,
                            checked: daysOfWeek === DaysOfWeekEnum.EveryDay
                        },
                        {
                            key: DailySheduleOptionEnum.EveryWeekday.toString(),
                            text: 'Every weekday',
                            checked: daysOfWeek === DaysOfWeekEnum.WorkDays
                        }
                    ]}
                    onChanged={this.onChoiceGroupOptionChanged}
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
