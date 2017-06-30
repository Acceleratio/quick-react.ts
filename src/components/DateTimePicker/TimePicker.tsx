import * as React from 'react';
import * as classNames from 'classnames';
import * as NumericInput from 'react-numeric-input';
import { Slider } from '../Slider/Slider';
import { TextField } from '../TextField/TextField';
import { autobind } from '../../utilities/autobind';

import * as moment from 'moment';

export interface ITimePickerProps {
    hour: number;
    minute: number;
    is24Hour: boolean;
    useKeyboardInput?: boolean;
    onTimeChanged: (hour: number, minute: number) => void;
}

export class TimePicker extends React.Component<ITimePickerProps, any> {
    private isPeriodPm: boolean;
    private hourHover: boolean;
    private minuteHover: boolean;

    public static defaultProps = {
        useKeyboardInput: false
    };

    @autobind
    onHourSliderEnter() {
        this.hourHover = true;
        this.forceUpdate();
    }

    @autobind
    onHourSliderLeave() {
        this.hourHover = false;
        this.forceUpdate();
    }

    @autobind
    onMinuteSliderEnter() {
        this.minuteHover = true;
        this.forceUpdate();
    }

    @autobind
    onMinuteSliderLeave() {
        this.minuteHover = false;
        this.forceUpdate();
    }

    @autobind
    onHourSliderChange(value) {
        this.props.onTimeChanged(value, this.props.minute);
    }

    @autobind
    onMinuteSliderChange(value) {
        this.props.onTimeChanged(this.props.hour, value);
    }

    normalizeHours(hour: number, is24Hour: boolean) {
        if (!is24Hour) {
            if (hour > 12) {
                hour = 12;
            }
        } else {
            if (hour > 23) {
                hour = 23;
            }
        }
        return hour;
    }

    convertTo24HourFormat(hour: number, is24Hour: boolean, isPeriodPm: boolean) {
        if (is24Hour) {
            return hour;
        }
        if (isPeriodPm) {
            if (hour < 12) {
                hour += 12;
            }
        } else {
            if (hour === 12) {
                hour = 0;
            }
        }
        return hour;
    }

    @autobind
    onHourInputChange(e) {
        let hour = parseInt(e.target.value, 10);
        if (isNaN(hour)) {
            return;
        }

        hour = this.normalizeHours(hour, this.props.is24Hour);
        hour = this.convertTo24HourFormat(hour, this.props.is24Hour, this.isPeriodPm);
        this.props.onTimeChanged(hour, this.props.minute);
    }

    @autobind
    onMinuteInputChange(e) {
        let minute = parseInt(e.target.value, 10);
        if (isNaN(minute)) {
            return;
        }
        if (minute > 59) {
            minute = 59;
        }
        this.props.onTimeChanged(this.props.hour, minute);
    }

    @autobind
    onInputBlur(e) {
        if (isNaN(parseInt(e.target.value, 10))) {
            this.forceUpdate();
            return;
        }
    }

    @autobind
    changePeriod() {
        let { hour, minute } = this.props;
        let newHour: number;
        if (this.isPeriodPm) {
            newHour = hour - 12;
            this.isPeriodPm = false;
        } else {
            newHour = hour + 12;
            this.isPeriodPm = true;
        }
        this.props.onTimeChanged(newHour, minute);
    }

    public render(): JSX.Element {

        let { hour, minute, useKeyboardInput, is24Hour } = this.props;
        let amPmDesignator: string = '';
        let hourDisp: any;
        hourDisp = hour;

        if (!is24Hour) {
            if (hour >= 12) {
                amPmDesignator = 'PM';
                this.isPeriodPm = true;
                if (hour > 12) {
                    hourDisp -= 12;
                }
            } else {
                if (hour === 0) {
                    hourDisp = 12;
                }
                amPmDesignator = 'AM';
                this.isPeriodPm = false;
            }
        }
        if (hourDisp < 10) {
            hourDisp = '0' + hourDisp;
        }
        let minuteDisp: any;
        if (minute < 10) {
            minuteDisp = '0' + minute;
        } else {
            minuteDisp = minute.toString();
        }
        let hourClasses = classNames('time-picker-hours',
            {
                isSelected: this.hourHover
            });

        let minuteClasses = classNames('time-picker-minute',
            {
                isSelected: this.minuteHover
            });

        let hourPicker, minutePicker;

        if (useKeyboardInput) {
            hourPicker = <NumericInput
                className={hourClasses}
                min={0}
                max={this.props.is24Hour ? 23 : 12}
                maxLength={2}
                value={hourDisp}
                onBlur={this.onInputBlur}
                style={false}
                onKeyUp={this.onHourInputChange} />;

            minutePicker = <NumericInput
                className={minuteClasses}
                min={0}
                max={59}
                maxLength={2}
                value={minuteDisp}
                onBlur={this.onInputBlur}
                style={false}
                onKeyUp={this.onMinuteInputChange} />;
        } else {
            hourPicker = <span className={hourClasses}>{hourDisp}</span>;
            minutePicker = <span className={minuteClasses}>{minuteDisp}</span>;
        }
        return (
            <div className="time-picker">
                <div className="time-picker-time-value">
                    {hourPicker}
                    <span className="time-picker-colon">:</span>
                    {minutePicker}
                    {!is24Hour &&
                        <span
                            onClick={this.changePeriod}
                            className="time-picker-ampm-designator">
                            {amPmDesignator}
                        </span>
                    }
                </div>
                <div className="time-picker-sliders">
                    <div onMouseEnter={this.onHourSliderEnter} onMouseLeave={this.onHourSliderLeave}><Slider value={hour} min={0} max={23} showValue={false} onChange={this.onHourSliderChange} /></div>
                    <div onMouseEnter={this.onMinuteSliderEnter} onMouseLeave={this.onMinuteSliderLeave}><Slider value={minute} min={0} max={59} showValue={false} onChange={this.onMinuteSliderChange} /></div>
                </div>
            </div>

        );
    }
}
