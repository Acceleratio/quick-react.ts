/* tslint:disable:no-bitwise */
import * as React from 'react';
import * as NumericInput from 'react-numeric-input';
import { IInnerSchedulerProps, MonthlySheduleOptionEnum } from './InnerScheduler.Props';
import { TextField } from '../../TextField/TextField';
import { DaysOfWeekEnum, WeeksOfMonthEnum, DayOfMonthEnum } from '../Scheduler.Props';
import { ChoiceGroup } from '../../ChoiceGroup/ChoiceGroup';
import { DropdownType, IDropdownOption } from '../../Dropdown/Dropdown.Props';
import { Dropdown } from '../../Dropdown/Dropdown';

export class MonthlyScheduler extends React.Component<IInnerSchedulerProps, {}> {

    render() {
        let {
            sendOnSpecificDays,
            daysOfMonth,
            sendOnSpecificWeekDays,
            weeksOfMonth,
            daysOfWeek,
            recurrencePeriod
        } = this.props.schedule;

        const dayOfMonthChoiceText: any = (
            <div className="choice-item-content">
                <span>Day</span>
                <Dropdown
                    hasTitleBorder={true}
                    options={this.dayOfMonthDropdownOptions}
                    onChanged={this.onDayOfMonthChanged}
                    selectedKey={daysOfMonth}
                    dropdownType={DropdownType.selectionDropdown}
                    calloutClassName="scheduler-day-of-month-dropdown-callout"
                />
                <span>of every</span>
                <TextField
                    type="number"
                    min="1"
                    value={recurrencePeriod.toString()}
                    onChanged={this.onMonthRecurrencePeriodChanged}
                />
                <span>month(s)</span>
            </div>
        );

        const dayOfWeekChoiceText: any = (
            <div className="choice-item-content">
                <span>The</span>
                <Dropdown
                    hasTitleBorder={true}
                    options={this.weekOfMonthDropdownOptions}
                    onChanged={this.onWeeksOfMonthChanged}
                    selectedKey={weeksOfMonth}
                    dropdownType={DropdownType.selectionDropdown}
                />
                <Dropdown
                    hasTitleBorder={true}
                    options={this.dayOfWeekDropdownOptions}
                    onChanged={this.onSelectedDayOfWeekChanged}
                    selectedKey={daysOfWeek}
                    dropdownType={DropdownType.selectionDropdown}
                />
                <span>of every</span>
                <TextField
                    type="number"
                    min="1"
                    value={recurrencePeriod.toString()}
                    onChanged={this.onMonthRecurrencePeriodChanged}
                />
                <span>months(s)</span>
            </div>
        );


        return (
            <div className="monthly-scheduler inner-scheduler">
                <ChoiceGroup
                    options={[
                        {
                            key: MonthlySheduleOptionEnum.OnDayOfMonth,
                            text: 'On specific day of month',
                            checked: sendOnSpecificDays,
                            additionalContent: dayOfMonthChoiceText
                        },
                        {
                            key: MonthlySheduleOptionEnum.OnDayOfWeek,
                            text: 'On specific day of week',
                            checked: sendOnSpecificWeekDays,
                            additionalContent: dayOfWeekChoiceText
                        }
                    ]}
                    onChanged={this.onChoiceGroupOptionChanged}
                />
            </div>
        );
    }

    onDayOfMonthChanged = (option, index) => {
        const newSchedule = {
            ...this.props.schedule,
            daysOfMonth: option.key
        };
        this.props.onScheduleChanged(newSchedule);
    }

    onMonthRecurrencePeriodChanged = (input) => {
        const value = parseInt(input, 10);
        let newSchedule = {
            ...this.props.schedule,
            recurrencePeriod: value
        };
        this.props.onScheduleChanged(newSchedule);
    }

    onChoiceGroupOptionChanged = (value) => {
        let sendOnSpecificDays: boolean;
        let sendOnSpecificWeekDays: boolean;
        if (value.key === MonthlySheduleOptionEnum.OnDayOfMonth.toString()) {
            sendOnSpecificDays = true;
            sendOnSpecificWeekDays = false;
        } else {
            sendOnSpecificDays = false;
            sendOnSpecificWeekDays = true;
        }
        const newSchedule = {
            ...this.props.schedule,
            sendOnSpecificDays: sendOnSpecificDays,
            sendOnSpecificWeekDays: sendOnSpecificWeekDays
        };
        this.props.onScheduleChanged(newSchedule);
    }

    onWeeksOfMonthChanged = (option, index) => {
        const newSchedule = {
            ...this.props.schedule,
            weeksOfMonth: option.key
        };
        this.props.onScheduleChanged(newSchedule);
    }

    onSelectedDayOfWeekChanged = (option, index) => {
        const newSchedule = {
            ...this.props.schedule,
            daysOfWeek: option.key
        };
        this.props.onScheduleChanged(newSchedule);
    }

    private dayOfWeekDropdownOptions = [
        { key: DaysOfWeekEnum.EveryDay, text: 'Day' },
        { key: DaysOfWeekEnum.WorkDays, text: 'Weekday' },
        { key: DaysOfWeekEnum.WeekendDays, text: 'Weekend day' },
        { key: DaysOfWeekEnum.Sunday, text: 'Sunday' },
        { key: DaysOfWeekEnum.Monday, text: 'Monday' },
        { key: DaysOfWeekEnum.Tuesday, text: 'Tuesday' },
        { key: DaysOfWeekEnum.Wednesday, text: 'Wednesday' },
        { key: DaysOfWeekEnum.Thursday, text: 'Thursday' },
        { key: DaysOfWeekEnum.Friday, text: 'Friday' },
        { key: DaysOfWeekEnum.Saturday, text: 'Saturday' }
    ];

    private weekOfMonthDropdownOptions = [
        { key: WeeksOfMonthEnum.First, text: 'First' },
        { key: WeeksOfMonthEnum.Second, text: 'Second' },
        { key: WeeksOfMonthEnum.Third, text: 'Third' },
        { key: WeeksOfMonthEnum.Fourth, text: 'Fourth' },
        { key: WeeksOfMonthEnum.Last, text: 'Last' }
    ];

    private dayOfMonthDropdownOptions = [
        { key: DayOfMonthEnum.Day1, text: '1' },
        { key: DayOfMonthEnum.Day2, text: '2' },
        { key: DayOfMonthEnum.Day3, text: '3' },
        { key: DayOfMonthEnum.Day4, text: '4' },
        { key: DayOfMonthEnum.Day5, text: '5' },
        { key: DayOfMonthEnum.Day6, text: '6' },
        { key: DayOfMonthEnum.Day7, text: '7' },
        { key: DayOfMonthEnum.Day8, text: '8' },
        { key: DayOfMonthEnum.Day9, text: '9' },
        { key: DayOfMonthEnum.Day10, text: '10' },
        { key: DayOfMonthEnum.Day11, text: '11' },
        { key: DayOfMonthEnum.Day12, text: '12' },
        { key: DayOfMonthEnum.Day13, text: '13' },
        { key: DayOfMonthEnum.Day14, text: '14' },
        { key: DayOfMonthEnum.Day15, text: '15' },
        { key: DayOfMonthEnum.Day16, text: '16' },
        { key: DayOfMonthEnum.Day17, text: '17' },
        { key: DayOfMonthEnum.Day18, text: '18' },
        { key: DayOfMonthEnum.Day19, text: '19' },
        { key: DayOfMonthEnum.Day20, text: '20' },
        { key: DayOfMonthEnum.Day21, text: '21' },
        { key: DayOfMonthEnum.Day22, text: '22' },
        { key: DayOfMonthEnum.Day23, text: '23' },
        { key: DayOfMonthEnum.Day24, text: '24' },
        { key: DayOfMonthEnum.Day25, text: '25' },
        { key: DayOfMonthEnum.Day26, text: '26' },
        { key: DayOfMonthEnum.Day27, text: '27' },
        { key: DayOfMonthEnum.Day28, text: '28' },
        { key: DayOfMonthEnum.Day29, text: '29' },
        { key: DayOfMonthEnum.Day30, text: '30' },
        { key: DayOfMonthEnum.Day31, text: '31' }
    ];
}
