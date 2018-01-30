import * as React from 'react';
import * as classNames from 'classnames';
import { ICheckboxProps } from './Checkbox.Props';
import { assign } from '../../utilities/object';
import { autobind } from '../../utilities/autobind';
import { getId } from '../../utilities/getId';
import { CommonComponent } from '../Common/Common';
import { Icon } from '../Icon/Icon';
import './Checkbox.scss';
import { Tooltip } from '../../index';

export interface ICheckboxState {
    isFocused?: boolean;
    isChecked?: boolean;
}

export class Checkbox extends CommonComponent<ICheckboxProps, ICheckboxState> {

    public static defaultProps: ICheckboxProps = {
    };

    private id: string;
    private _checkBox: HTMLInputElement;

    constructor(props) {
        super(props);

        this.id = getId('checkbox-');
        this.state = {
            isFocused: false,
            isChecked: props.defaultChecked || false
        };
    }

    public shouldComponentUpdate(nextProps) {
        return !(this.props.checked === nextProps.checked
            && this.props.className === nextProps.className
            && this.props.label === nextProps.label
            && this.props.disabled === nextProps.disabled
            && this.props.itemID === nextProps.itemId
        );
    }

    @autobind
    private _renderCheckBox() {
        const { checked, defaultChecked, disabled, inputProps, label, id, iconClassName } = this.props;
        const { isFocused } = this.state;
        const isChecked = checked === undefined ? this.state.isChecked : checked;

        const className = classNames({
            'checkbox': true,
            'checked': isChecked
        }, [this.props.className]);

        const labelClassName = classNames({
            'checkbox-label': true,
            'is-checked': isChecked,
            'is-disabled': disabled
        });
        const innerLabelClassName = classNames(
            {
                'label-with-icon': iconClassName !== undefined,
                'label': iconClassName === undefined
            }
        );
        return (
            <div className={className}>
                <input
                    { ...inputProps }
                    { ...(checked !== undefined && { checked }) }
                    { ...(defaultChecked !== undefined && { defaultChecked }) }
                    disabled={disabled}
                    ref={this._resolveRef('_checkBox')}
                    className={'checkbox-input'}
                    id={this.id}
                    name={this.id}
                    type="checkbox"
                    onChange={this._onChange}
                    onFocus={this._onFocus}
                    onBlur={this._onBlur}
                />

                <label htmlFor={this.id} className={labelClassName} title={this.props.tooltip ? undefined : label}>
                    {isChecked && <Icon htmlFor={this.id} className={'checkboxCheckmark'} iconName={'icon-checkmark'} ></Icon>}
                    {iconClassName && <Icon htmlFor={this.id} iconName={iconClassName} className={'label-icon'} />}
                    {label && <span className={innerLabelClassName}>{label}</span>}
                </label>
            </div>
        );
    }

    render() {
        if (this.props.tooltip) {
            return <Tooltip {...this.props.tooltip}>
                {this._renderCheckBox()}
            </Tooltip>;
        }

        return this._renderCheckBox();
    }

    public get checked(): boolean {
        return this._checkBox ? this._checkBox.checked : false;
    }

    public focus() {
        if (this._checkBox) {
            this._checkBox.focus();
        }
    }

    @autobind
    private _onFocus(ev: React.FocusEvent<HTMLInputElement>): void {
        const { inputProps } = this.props;

        if (inputProps && inputProps.onFocus) {
            inputProps.onFocus(ev);
        }

        this.setState({ isFocused: true });
    }

    @autobind
    private _onBlur(ev: React.FocusEvent<HTMLInputElement>): void {
        const { inputProps } = this.props;

        if (inputProps && inputProps.onBlur) {
            inputProps.onBlur(ev);
        }

        this.setState({ isFocused: false });
    }

    @autobind
    private _onChange(ev: React.FormEvent<HTMLInputElement>) {
        const { onChange, itemId } = this.props;
        const isChecked = (ev.target as HTMLInputElement).checked;

        if (onChange) {
            onChange(ev, itemId, isChecked);
        }

        if (this.props.checked === undefined) {
            this.setState({ isChecked: isChecked });
        }
    }
}
