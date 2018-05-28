import * as React from 'react';
import * as classNames from 'classnames';
import { ICustomDateRangeProps, ICustomDateRangeState, IDateValidation, DateValidator } from './CustomDateRange.Props';
import { Dialog } from '../Dialog/Dialog';
import { DateTimePicker } from '../DateTimePicker/DateTimePicker';
import { DialogFooter } from '../Dialog/DialogFooter';
import { Button } from '../Button/Button';
import { autobind } from '../../utilities/autobind';
import { Icon } from '../Icon/Icon';
import * as moment from 'moment';
import './CustomDateRange.scss';
import { Tooltip } from '../Tooltip/Tooltip';
import { DirectionalHint } from '../../utilities/DirectionalHint';
import { DialogFooterSection, DialogFooterSectionPosition } from '../..';
import { nullFunc } from '../../utilities/common';

const baseDateValidationMessage = 'Start date cannot be after end date!';

const baseDateValidation: DateValidator = (selectedStartDate: Date, selectedEndDate: Date) => {
    const startDate = moment(selectedStartDate);
    const endDate = moment(selectedEndDate);
    const isValidated = !startDate.isAfter(endDate);

    return {
        isValidated: isValidated,
        validationErrorMessage: baseDateValidationMessage
    } as IDateValidation;
};

const defaultDateRangeValidation = { isValidated: true, validationErrorMessage: '' };

export class CustomDateRange extends React.PureComponent<ICustomDateRangeProps, ICustomDateRangeState> {
    public static defaultProps = {
        onDateSelectionChanged: nullFunc,
        validationFunctions: []
    };

    constructor(props: ICustomDateRangeProps) {
        super(props);

        this.state = {
            startDate: props.startDate,
            endDate: props.endDate,
            dateRangeValidation: defaultDateRangeValidation
        };
    }

    public componentWillReceiveProps(newProps: ICustomDateRangeProps) {
        if (this.props.startDate !== newProps.startDate || this.props.endDate !== newProps.endDate) {
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            });
        }
    }

    @autobind
    private _closeCustomDateRangeDialog() {
        if (this.props.onClose !== undefined) {
            this.props.onClose();
        }

        this.setState({
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            dateRangeValidation: defaultDateRangeValidation
        });
    }

    @autobind
    private _saveCustomDateRangeDialog() {
        const validation = this.validate(this.state.startDate, this.state.endDate);
        if (validation.isValidated) {
            if (this.props.onSave !== undefined) {
                this.props.onSave(this.state.startDate, this.state.endDate);
            }
        }
        this._closeCustomDateRangeDialog();
    }

    @autobind
    private _startDateSelection(date: Date) {
        this.setState({
            startDate: date
        });
        const validation = this.validate(date, this.state.endDate);
        if (validation.isValidated) {
            this.props.onDateSelectionChanged(date, this.state.endDate);
        }
    }

    @autobind
    private _endDateSelection(date: Date) {
        this.setState({
            endDate: date
        });
        const validation = this.validate(this.state.startDate, date);
        if (validation.isValidated) {
            this.props.onDateSelectionChanged(this.state.startDate, date);
        }
    }

    private validate = (selectedStartDate: Date, selectedEndDate: Date): IDateValidation => {
        const validationFuncs = [...this.props.validationFunctions].concat(baseDateValidation);
        const validations = validationFuncs.map(v => v(selectedStartDate, selectedEndDate));

        const hasErrors = validations.every(v => v.isValidated);
        const validationErrorMessage = validations.filter(v => !v.isValidated).map(v => v.validationErrorMessage).reduce((s, e) => {
            if (s === '') {
                return e + '\n';
            } else {
                return s + '\n' + e;
            }
        }, '');

        const validationObj: IDateValidation = {
            isValidated: hasErrors,
            validationErrorMessage: validationErrorMessage
        };

        this.setState({ dateRangeValidation: validationObj });

        return validationObj;
    }

    private dateToString(d: Date): string {
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    }

    public render() {
        let {
            className,
            isDialogOpen,
            invalidDateRangeSelected
        } = this.props;

        const valid = (current) => {
            return current.isBefore(moment());
        };

        let startTimeText = this.dateToString(this.state.startDate);
        let endTimeText = this.dateToString(this.state.endDate);

        const dialogClassName = classNames(
            'custom-date-range-dialog',
            [this.props.className]
        );

        return (
            <Dialog
                isOpen={isDialogOpen}
                title="Select time range:"
                hasCloseXButton={true}
                onDismiss={this._closeCustomDateRangeDialog}
                containerClassName={dialogClassName}>
                <div className="custom-date-range-content">
                    <div className="custom-date-range-title">Start: {startTimeText}</div>
                    <DateTimePicker
                        is24HourFormat={false}
                        selectedDateTime={this.state.startDate}
                        includeTime={true}
                        onTimeSelectionChanged={this._startDateSelection}
                        useKeyboardForTimeInput={true}
                        isValidDate={valid}
                    />
                </div>
                <div className="custom-date-range-content">
                    <div className="custom-date-range-title">End: {endTimeText}</div>
                    <DateTimePicker
                        is24HourFormat={false}
                        selectedDateTime={this.state.endDate}
                        includeTime={true}
                        onTimeSelectionChanged={this._endDateSelection}
                        useKeyboardForTimeInput={true}
                        isValidDate={valid}
                    />
                </div>

                <DialogFooter>
                    {!this.state.dateRangeValidation.isValidated &&
                        <DialogFooterSection position={DialogFooterSectionPosition.Left}>
                            <Tooltip
                                content={this.state.dateRangeValidation.validationErrorMessage}
                                className={'tooltip-error'}
                                directionalHint={DirectionalHint.rightCenter}
                                containerClass={'custom-date-range-error'}
                            >
                                <Icon iconName="icon-warning2" /><span className="custom-date-range-error">Validation errors</span>
                            </Tooltip>
                        </DialogFooterSection>
                    }
                    <Button className="button-textual" onClick={this._closeCustomDateRangeDialog}>Cancel</Button>
                    <Button onClick={this._saveCustomDateRangeDialog} disabled={!this.state.dateRangeValidation.isValidated}>Save</Button>
                </DialogFooter>
            </Dialog>
        );
    }
}
