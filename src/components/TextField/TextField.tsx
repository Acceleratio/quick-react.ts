import * as React from 'react';
import * as classNames from 'classnames';
import { autobind } from '../../utilities/autobind';
import { KeyCodes } from '../../utilities/KeyCodes';
import { ITextFieldProps } from './TextField.Props';
import { Async } from '../../utilities/Async';
import { getId } from '../../utilities/getId';
import { Label } from '../../components/Label/Label';
import { getNativeAttributes, textAreaAttributes, inputAttributes } from '../../utilities/attributes';
import './TextField.scss';
import { Tooltip } from '../Tooltip/Tooltip';
import { DirectionalHint } from '../../utilities/DirectionalHint';
import { Icon } from '../Icon/Icon';

export interface ITextFieldState {
    value?: string;
    isFocused?: boolean;
    errorMessage?: string;
}

export class TextField extends React.Component<ITextFieldProps, ITextFieldState> {
    public static defaultProps: ITextFieldProps = {
        multiline: false,
        resizable: true,
        underlined: false,
        onChanged: () => { },
        onBeforeChange: () => { },
        onNotifyValidationResult: () => { },
        onGetErrorMessage: () => undefined,
        onAccept: () => { },
        deferredValidationTime: 200,
        errorMessage: ''
    };

    private _id: string;
    private _descriptionId: string;
    private _async: Async;
    private _delayedValidate: (value: string) => void;
    private _isMounted: boolean;
    private _lastValidation: number;
    private _latestValidateValue;
    private _willMountTriggerValidation;
    private _field;

    constructor(props) {
        super(props);

        this._id = getId('textField');
        this._descriptionId = getId('textFieldDescription');
        this._async = new Async(this);

        this.state = {
            value: props.value || props.defaultValue || '',
            isFocused: false,
            errorMessage: ''
        };

        this._onInputChange = this._onInputChange.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._delayedValidate = this._async.debounce(this._validate, this.props.deferredValidationTime);
        this._lastValidation = 0;
        this._willMountTriggerValidation = false;
    }

    /**
    * Gets the current value of the text field.
    */
    public get value(): string {
        return this.state.value;
    }

    public componentWillMount() {
        this._willMountTriggerValidation = true;
        this._validate(this.state.value);
    }

    public componentDidMount() {
        this._isMounted = true;
    }

    public componentWillReceiveProps(newProps: ITextFieldProps) {
        const { onBeforeChange } = this.props;

        if (newProps.value !== undefined && newProps.value !== this.state.value) {
            if (onBeforeChange) {
                onBeforeChange(newProps.value);
            }

            this.setState({
                value: newProps.value,
                errorMessage: ''
            } as ITextFieldState);

            this._delayedValidate(newProps.value);
        }
    }

    public componentWillUnmount() {
        this._async.dispose();
        this._isMounted = false;
    }

    public render() {
        let { disabled, required, multiline, underlined, label, description, iconClass, className } = this.props;
        let { isFocused } = this.state;
        const errorMessage: string = this._errorMessage;

        const textFieldClassName = classNames(
            'text-field',
            {
                'is-required': required,
                'is-disabled': disabled,
                'is-active': isFocused,
                'text-field-multiline': multiline,
                'text-field-underlined': underlined
            },
            [this.props.className]
        );

        return (
            <div className={textFieldClassName} id={this.props.id} >
                {label && <Label htmlFor={this._id}>{label}</Label>}
                {iconClass && <i className={iconClass}></i>}
                {multiline ? this._renderTextArea() : this._renderInput()}
            </div>
        );
    }

    /**
    * Sets focus on the text field
    */
    public focus() {
        if (this._field) {
            this._field.focus();
        }
    }

    /**
   * Selects the text field
   */
    public select() {
        if (this._field) {
            this._field.select();
        }
    }

    /**
    * Sets the selection start of the text field to a specified value
    */
    public setSelectionStart(value: number) {
        if (this._field) {
            this._field.selectionStart = value;
        }
    }

    /**
    * Sets the selection end of the text field to a specified value
    */
    public setSelectionEnd(value: number) {
        if (this._field) {
            this._field.selectionEnd = value;
        }
    }

    private _onInputChange(event: React.ChangeEvent<any>): void {
        const element: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        const value: string = element.value;

        this.setState({
            value: value,
            errorMessage: ''
        } as ITextFieldState);

        this._willMountTriggerValidation = false;
        this._delayedValidate(value);

        const { onBeforeChange } = this.props;
        onBeforeChange(value);
    }

    private _onFocus(ev: React.FocusEvent<any>) {
        if (this.props.onFocus) {
            this.props.onFocus(ev);
        }

        this.setState({
            isFocused: true
        });
    }

    private _onBlur(ev: React.FocusEvent<any>) {
        if (this.props.onBlur) {
            this.props.onBlur(ev);
        }

        this.setState({
            isFocused: false
        });
    }

    private _validate(value: string): void {
        if (this._latestValidateValue === value) {
            return;
        }

        this._latestValidateValue = value;
        let { onGetErrorMessage } = this.props;
        let result: string | PromiseLike<string> = onGetErrorMessage(value || '');

        if (result !== undefined) {
            if (typeof result === 'string') {
                this.setState({
                    errorMessage: result
                } as ITextFieldState);

                this._notifyAfterValidate(value, result);
            } else {
                let currentValidation: number = ++this._lastValidation;

                result.then((errorMessage: string) => {
                    if (this._isMounted && currentValidation === this._lastValidation) {
                        this.setState({
                            errorMessage
                        } as ITextFieldState);
                    }

                    this._notifyAfterValidate(value, errorMessage);
                });
            }
        } else {
            this._notifyAfterValidate(value, '');
        }
    }

    private _notifyAfterValidate(value: string, errorMessage: string): void {
        if (!this._willMountTriggerValidation && value === this.state.value) {
            const { onNotifyValidationResult } = this.props;
            onNotifyValidationResult(errorMessage, value);

            if (!errorMessage) {
                const { onChanged } = this.props;
                onChanged(value);
            }
        } else {
            this._willMountTriggerValidation = false;
        }
    }

    private get _errorMessage(): string {
        let { errorMessage } = this.state;

        if (!errorMessage) {
            errorMessage = this.props.errorMessage;
        }

        return errorMessage;
    }

    private get _fieldClassName(): string {
        const errorMessage: string = this._errorMessage;
        let textFieldClassName: string;

        if (this.props.multiline && !this.props.resizable) {
            textFieldClassName = 'textField-field textField-field-unresizable';
        } else {
            textFieldClassName = 'textField-field';
        }

        return classNames(textFieldClassName, this.props.inputClassName, {
            'textField-invalid': !!errorMessage
        });
    }

    private _renderTextArea(): React.ReactElement<React.HTMLProps<HTMLAreaElement>> {
        let textAreaProps = getNativeAttributes(this.props, textAreaAttributes, ['defaultValue']);

        let showTooltip = false;
        if (this.props.errorMessage !== undefined) {
            showTooltip = this.props.errorMessage !== '' && this.state.isFocused;

        } else {
            showTooltip = this.state.isFocused;
        }

        return (
            <div className="text-field-textarea-error-container">
                <Tooltip
                    content={this.props.errorMessage}
                    className="tooltip-error"
                    showTooltip={showTooltip}
                    directionalHint={DirectionalHint.bottomLeftEdge}>
                    <div className="text-field-textarea-error-content">
                        <textarea
                            { ...textAreaProps }
                            id={this._id}
                            ref={(c): HTMLTextAreaElement => this._field = c}
                            value={this.state.value}
                            onChange={this._onInputChange}
                            onKeyUp={this._onKeyUp}
                            className={this._fieldClassName}
                            onFocus={this._onFocus}
                            onBlur={this._onBlur}
                        />
                    </div>
                </Tooltip>
                {this.props.description &&
                    <span id={this._descriptionId} className={'text-field-textarea-error-info-container'}>
                        <Tooltip content={this.props.description} directionalHint={DirectionalHint.rightCenter}>
                            <Icon iconName={'icon-Info_krug'} className={'text-field-info'}></Icon>
                        </Tooltip>
                    </span>
                }
            </div>
        );
    }

    private _renderInput(): React.ReactElement<React.HTMLProps<HTMLInputElement>> {
        let inputProps = getNativeAttributes<React.HTMLProps<HTMLInputElement>>(this.props, inputAttributes, ['defaultValue']);

        let showTooltip = false;
        if (this.props.errorMessage !== undefined) {
            showTooltip = this.props.errorMessage !== '' && this.state.isFocused;

        } else {
            showTooltip = this.state.isFocused;
        }

        return (
            <div className="text-field-input-error-container">
                <Tooltip
                    content={this.props.errorMessage}
                    className="tooltip-error"
                    showTooltip={showTooltip}
                    directionalHint={DirectionalHint.bottomLeftEdge}>
                    <div className="text-field-input-error-content">
                        <input
                            type={'text'}
                            { ...inputProps }
                            id={this._id}
                            ref={(c): HTMLInputElement => this._field = c}
                            value={this.state.value}
                            onChange={this._onInputChange}
                            onKeyUp={this._onKeyUp}
                            className={this._fieldClassName}
                            onFocus={this._onFocus}
                            onBlur={this._onBlur}
                        />
                        {this.props.errorMessage &&
                            <span className="textField-error-icon">
                                <Icon iconName={'icon-warning2'}></Icon>
                            </span>
                        }
                    </div>
                </Tooltip>
                {this.props.description &&
                    <span id={this._descriptionId} className={'text-field-input-error-info-container'}>
                        <Tooltip content={this.props.description} directionalHint={DirectionalHint.rightCenter}>
                            <Icon iconName={'icon-Info_krug'} className={'text-field-info'}></Icon>
                        </Tooltip>
                    </span>
                }
            </div>
        );
    }

    @autobind
    private _onKeyUp(ev: React.KeyboardEvent<HTMLElement>) {
        const { onAccept, multiline } = this.props;
        switch (ev.which) {
            case KeyCodes.enter:
                if (!multiline) {
                    this._validate(this._field.value);

                    // problems with React batched updates and trying to use the changed value immediately when enter was pressed 
                    if (onAccept) {
                        setTimeout(onAccept, 0);
                    }
                }
                break;
            default:
                return;
        }

        // We only get here if the keypress has been handled.
        ev.preventDefault();
        ev.stopPropagation();
    }
}
