import * as React from 'react';
import { ISchedulerProps, ScheduleTypeEnum } from './Scheduler.Props';
import { Dropdown } from '../Dropdown/Dropdown';
import { DateTimeDropdownPicker } from '../DateTimeDropdownPicker/DateTimeDropdownPicker';
import { HourlyScheduler } from './InnerSchedulers/HourlyScheduler';
import * as classNames from 'classnames';

export class Scheduler extends React.PureComponent<ISchedulerProps, any> {
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

        let component;
        switch (selectedScheduleType) {
            case ScheduleTypeEnum.OneTime:
                component = null;
                break;
            case ScheduleTypeEnum.Hourly:
                component = (
                    <HourlyScheduler
                        schedule={schedule}
                        onScheduleChanged={onScheduleChanged}
                        {...schedule} />);
                break;
                case ScheduleTypeEnum.Minutely:
                component = (
                    <HourlyScheduler
                        schedule={schedule}
                        onScheduleChanged={onScheduleChanged}
                        {...schedule} />);
                break;
            default:
                component = null;
        }

        return (
            <div className={classNames('scheduler', className)}>
                <Dropdown
                    options={dropdownOptions}
                    onChanged={scheduleTypeChanged}
                    label={dropdownLabel}
                    selectedKey={selectedScheduleType}

                />
                <div>Start time:</div>
                <DateTimeDropdownPicker
                    selectedDate={schedule.startTime}
                    onTimeSelectionChanged={this.startDateTimeChanged}
                    className="date-time-picker-dropdown"
                />
                {component}
            </div>
        );
    }

    startDateTimeChanged = (date: Date) => {
        let newSchedule = {
            ...this.props.schedule,
            startTime: date
        };
        this.props.onScheduleChanged(newSchedule);
    }
}

