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

export interface ITimePickerState {
    isPeriodPm: boolean;
    hourHover: boolean;
    minuteHover: boolean;
    hourTimeFormat: (num: string) => string;
    minuteTimeFormat: (num: string) => string;
}

export class TimePicker extends React.Component<ITimePickerProps, ITimePickerState> {
    constructor(props: ITimePickerProps) {
        super(props);

        this.state = {
            isPeriodPm: props.hour >= 12,
            hourHover: false,
            minuteHover: false,
            hourTimeFormat: this.formatUnfocused,
            minuteTimeFormat: this.formatUnfocused
        };
    }

    public componentWillReceiveProps(nextProps: ITimePickerProps) {
        let { hour, is24Hour } = nextProps;
        if (!is24Hour) {
            if (hour >= 12) {
                this.setState({ isPeriodPm: true });
            } else {
                this.setState({ isPeriodPm: false });
            }
        }
    }

    public static defaultProps = {
        useKeyboardInput: false
    };

    @autobind
    onHourSliderEnter() {
        this.setState({
            hourHover: true
        });
    }

    @autobind
    onHourSliderLeave() {
        this.setState({
            hourHover: false
        });
    }

    @autobind
    onMinuteSliderEnter() {
        this.setState({
            minuteHover: true
        });
    }

    @autobind
    onMinuteSliderLeave() {
        this.setState({
            minuteHover: false
        });
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

    removeNonNumeric(num: string): string {
        return num.replace(/[\D]+/g, '');
    }

    @autobind
    formatHourFocused(num: string): string {
        if (num === '0' && this.props.is24Hour === false) {
            num = '12';
        }
        return this.removeNonNumeric(num);
    }

    @autobind
    formatUnfocused(num: string): string {
        num = this.removeNonNumeric(num);
        if (num.length === 1) {
            return '0' + num;
        } else {
            return num;
        }
    }

    @autobind
    onHourInputChange(e) {
        let hour = parseInt(e.target.value, 10);
        if (isNaN(hour)) {
            return;
        }

        hour = this.normalizeHours(hour, this.props.is24Hour);
        hour = this.convertTo24HourFormat(hour, this.props.is24Hour, this.state.isPeriodPm);
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
    onHourInputBlur(e) {
        this.setState({
            hourTimeFormat: this.formatUnfocused
        });
    }

    @autobind
    onMinuteInputBlur(e) {
        this.setState({
            minuteTimeFormat: this.formatUnfocused
        });
    }

    @autobind
    onHourInputFocus(e) {
        this.setState({
            hourTimeFormat: this.formatHourFocused
        });
    }

    @autobind
    onMinuteInputFocus(e) {
        this.setState({
            minuteTimeFormat: this.removeNonNumeric
        });
    }

    @autobind
    changePeriod() {
        let { hour, minute } = this.props;
        let newHour: number;
        if (this.state.isPeriodPm) {
            newHour = hour - 12;
        } else {
            newHour = hour + 12;
        }
        this.setState({
            isPeriodPm: !this.state.isPeriodPm
        });
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
                if (hour > 12) {
                    hourDisp -= 12;
                }
            } else {
                if (hour === 0) {
                    hourDisp = 12;
                }
                amPmDesignator = 'AM';
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
                isSelected: this.state.hourHover
            });

        let minuteClasses = classNames('time-picker-minute',
            {
                isSelected: this.state.minuteHover
            });

        let hourPicker, minutePicker;

        if (useKeyboardInput) {
            hourPicker = <NumericInput
                className={hourClasses}
                min={0}
                max={this.props.is24Hour ? 23 : 12}
                maxLength={2}
                value={hourDisp}
                onFocus={this.onHourInputFocus}
                onBlur={this.onHourInputBlur}
                style={false}
                format={this.state.hourTimeFormat}
                onKeyUp={this.onHourInputChange} />;

            minutePicker = <NumericInput
                className={minuteClasses}
                min={0}
                max={59}
                maxLength={2}
                value={minuteDisp}
                onFocus={this.onMinuteInputFocus}
                onBlur={this.onMinuteInputBlur}
                style={false}
                format={this.state.minuteTimeFormat}
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
