import * as React from 'react';
import * as classNames from 'classnames';
import { IChoiceGroupProps, IChoiceGroupOption } from './ChoiceGroup.Props';
import { getId } from '../../utilities/getId';
import './ChoiceGroup.scss';

export interface IChoiceGroupState {
    keyChecked: string;
    keyFocused?: string;
}

export class ChoiceGroup extends React.Component<IChoiceGroupProps, IChoiceGroupState> {
    public static defaultProps = {
        options: []
    };

    private _id: string;
    private _descriptionId: string;
    private _inputElement: HTMLInputElement;

    constructor(props) {
        super(props);

        this.state = {
            keyChecked: this._getKeyChecked(props.options),
            keyFocused: undefined
        };

        this._id = getId('ChoiceGroup');
        this._descriptionId = getId('ChoiceGroupDescription');
    }

    public componentWillReceiveProps(newProps: IChoiceGroupProps) {
        const newKeyChecked: string = this._getKeyChecked(newProps.options);
        const oldKeyChecked: string = this._getKeyChecked(this.props.options);

        if (newKeyChecked !== oldKeyChecked) {
            this.setState({
                keyChecked: newKeyChecked
            });
        }
    }

    public render() {
        let { label, options, className, required } = this.props;
        let { keyChecked, keyFocused } = this.state;

        const titleClassName = classNames(
            'label',
            className,
            {
                'is-required': required
            }
        );

        return (
            <div role="application" className={className}>
                <div
                    className={'choiceFieldGroup'}
                    role="radiogroup">
                    <div className={'choiceFieldGroup-title'}>
                        {this.props.label ?
                            <label className={titleClassName}
                                id={this._id + '-label'}>
                                {label}
                            </label>
                            : null}
                    </div>

                    {options.map((option) => (
                        <div
                            key={option.key}
                            className={classNames('choiceField', { 'is-inFocus': option.key === keyFocused })}>
                            <input
                                ref={(c): HTMLInputElement => this._inputElement = c}
                                id={`${this._id}-${option.key}`}
                                className={'choiceField-input'}
                                type="radio"
                                name={this._id}
                                disabled={option.isDisabled || option.disabled || this.props.disabled}
                                checked={option.key === keyChecked}
                                onChange={this._onChange.bind(this, option)}
                                onFocus={this._onFocus.bind(this, option)}
                                onBlur={this._onBlur.bind(this, option)}
                            />
                            {this._renderField(option)}
                            {option.additionalContent &&
                                this._renderAdditionalOptionContent(option, keyChecked)
                            }
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    public focus() {
        if (this._inputElement) {
            this._inputElement.focus();
        }
    }

    private _onFocus(option: IChoiceGroupOption, ev: React.FocusEvent<any>): void {
        this.setState({
            keyFocused: option.key,
            keyChecked: this.state.keyChecked
        });
    }

    private _onBlur(option: IChoiceGroupOption, ev: React.FocusEvent<any>): void {
        this.setState({
            keyFocused: undefined,
            keyChecked: this.state.keyChecked
        });
    }

    private _renderField(option: IChoiceGroupOption) {
        const { keyChecked } = this.state;
        let isDisabled = option.isDisabled || option.disabled || this.props.disabled;

        return (
            <label
                htmlFor={this._id + '-' + option.key}
                className={classNames('choiceField-field', { 'is-checked': option.key === keyChecked, 'is-disabled': isDisabled })}>
                <span id={`${this._descriptionId}-${option.key}`} className={'label'}>
                    {option.text}
                </span>
            </label>
        );
    }

    private _renderAdditionalOptionContent(option, keyChecked) {
        return (
            <div className={classNames('option-additional-content',
                { 'is-unchecked': option.key !== keyChecked })}
            >
                {option.additionalContent}
            </div>
        );
    }

    private _onChange(option: IChoiceGroupOption, ev: React.FormEvent<any>) {
        let { onChanged } = this.props;

        this.setState({
            keyChecked: option.key
        });

        if (onChanged) {
            onChanged(option);
        }
    }

    private _getKeyChecked(options: IChoiceGroupOption[]): string {
        const optionsChecked = options.filter((option: IChoiceGroupOption) => {
            return option.isChecked || option.checked;
        });

        if (optionsChecked.length === 0) {
            return undefined;
        } else {
            return optionsChecked[0].key;
        }
    }
}
