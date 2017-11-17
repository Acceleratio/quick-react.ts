import * as React from 'react';
import { ISchedulerProps, ScheduleTypeEnum } from './Scheduler.Props';
import { Dropdown } from '../Dropdown/Dropdown';
import { DateTimeDropdownPicker } from '../DateTimeDropdownPicker/DateTimeDropdownPicker';
import { HourlyScheduler } from './InnerSchedulers/HourlyScheduler';
import * as classNames from 'classnames';
import { DropdownType } from '../Dropdown/Dropdown.Props';
import { DailyScheduler } from './InnerSchedulers/DailyScheduler';
import { WeeklyScheduler } from './InnerSchedulers/WeeklyScheduler';
import { MonthlyScheduler } from './InnerSchedulers/MonthlyScheduler';
import { MinutelyScheduler } from './InnerSchedulers/MinutelyScheduler';
import './Scheduler.scss';

export class Scheduler extends React.Component<ISchedulerProps, {}> {
    public static defaultProps = {
        dropdownOptions: [
            { key: ScheduleTypeEnum.OneTime, text: 'One time' },
            { key: ScheduleTypeEnum.Minutely, text: 'On the minute' },
            { key: ScheduleTypeEnum.Hourly, text: 'Hourly' },
            { key: ScheduleTypeEnum.Daily, text: 'Daily' },
            { key: ScheduleTypeEnum.Weekly, text: 'Weekly' },
            { key: ScheduleTypeEnum.Monthly, text: 'Monthly' }
        ],
        dropdownLabel: 'Recurrence Type:'
    };

    render() {
        let { dropdownOptions,
            schedule,
            selectedScheduleType,
            scheduleTypeChanged,
            dropdownLabel,
            className,
            onScheduleChanged } = this.props;

        return (
            <div className={classNames('scheduler', className)}>
                <div className="dropdown-container">
                    <span>{dropdownLabel}</span>
                    <Dropdown
                        hasTitleBorder={true}
                        options={dropdownOptions}
                        onChanged={scheduleTypeChanged}
                        selectedKey={selectedScheduleType}
                        dropdownType={DropdownType.selectionDropdown}
                    />
                </div>
                <div className="dropdown-container">
                    <span>Start time:</span>
                    <DateTimeDropdownPicker
                        selectedDate={schedule.startTime}
                        onTimeSelectionChanged={this.startDateTimeChanged}
                        className="date-time-picker-dropdown"
                        includeTime={true}
                    />
                </div>
                {this.renderInnerComponent(selectedScheduleType,
                    schedule, onScheduleChanged)}
            </div>
        );
    }

    renderInnerComponent = (selectedScheduleType, schedule, onScheduleChanged) => {
        switch (selectedScheduleType) {
            case ScheduleTypeEnum.OneTime:
                return null;
            case ScheduleTypeEnum.Minutely:
                return (
                    <MinutelyScheduler
                        schedule={schedule}
                        onScheduleChanged={onScheduleChanged} />);
            case ScheduleTypeEnum.Hourly:
                return (
                    <HourlyScheduler
                        schedule={schedule}
                        onScheduleChanged={onScheduleChanged} />);
            case ScheduleTypeEnum.Daily:
                return (
                    <DailyScheduler
                        schedule={schedule}
                        onScheduleChanged={onScheduleChanged} />);
            case ScheduleTypeEnum.Weekly:
                return (
                    <WeeklyScheduler
                        schedule={schedule}
                        onScheduleChanged={onScheduleChanged} />);
            case ScheduleTypeEnum.Monthly:
                return (
                    <MonthlyScheduler
                        schedule={schedule}
                        onScheduleChanged={onScheduleChanged} />);
            default:
                return null;
        }
    }

    startDateTimeChanged = (date: Date) => {
        let newSchedule = {
            ...this.props.schedule,
            startTime: date
        };
        this.props.onScheduleChanged(newSchedule);
    }
}

