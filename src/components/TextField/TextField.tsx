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

export interface ITextFieldState {
    value ?: string;
    isFocused ?: boolean;
    errorMessage ?: string;
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
        onEnterClick: () => { },
        deferredValidationTime: 200,
        errorMessage: ''
    };

    private _id: string;
    private _descriptionId: string;
    private _async: Async;
    private _delayedValidate: (value: string) => void;
    private _isMounted: boolean;
    private _lastValidation : number;
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
            } as ITextFieldState );

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
            <div className={ textFieldClassName }>
                { label && <Label htmlFor={ this._id }>{ label }</Label> }
                { iconClass && <i className={ iconClass }></i> }
                { multiline ? this._renderTextArea() : this._renderInput() }
                { errorMessage && <div className={'screenReaderOnly'}>{ errorMessage }</div> }
                { (description || errorMessage) &&
                    <span id={this._descriptionId}>
                        { description && <span className={'textField-description'}>{ description }</span> }
                        { errorMessage && <p className={'textField-errorMessage slideDownIn20'}>{ errorMessage }</p> }
                    </span>    
                }
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

    private _onInputChange(event: React.ChangeEvent<any>) : void {
        const element: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        const value: string = element.value;

        this.setState({
            value: value,
            errorMessage: ''
        } as ITextFieldState );

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
                } as ITextFieldState );

                this._notifyAfterValidate(value, result);
            } else {
                let currentValidation: number = ++this._lastValidation;

                result.then((errorMessage: string) => {
                    if (this._isMounted && currentValidation === this._lastValidation) {
                        this.setState({
                            errorMessage
                        } as ITextFieldState );
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
        
        return(
            <textarea
                { ...textAreaProps }
                id={ this._id }
                ref={ (c): HTMLTextAreaElement => this._field = c }
                value={ this.state.value }
                onChange={ this._onInputChange }
                onKeyUp={ this._onEnterClick }
                className={ this._fieldClassName }
                onFocus={ this._onFocus }
                onBlur={ this._onBlur }
            />
        );
    }

    private _renderInput(): React.ReactElement<React.HTMLProps<HTMLInputElement>> {
        let inputProps = getNativeAttributes<React.HTMLProps<HTMLInputElement>>(this.props, inputAttributes, ['defaultValue']);
        
        return(
            <input
                type={'text'}
                { ...inputProps }
                id={ this._id }
                ref={ (c): HTMLInputElement => this._field = c }
                value={ this.state.value }
                onChange={ this._onInputChange }
                onKeyUp={ this._onEnterClick }
                className={ this._fieldClassName }
                onFocus={ this._onFocus }
                onBlur={ this._onBlur }
            />
        );
    }

    @autobind
    private _onEnterClick(ev: React.KeyboardEvent<HTMLElement>) {
        const { onEnterClick } = this.props;

        if (onEnterClick !== undefined) {
            switch (ev.which) {     
                case KeyCodes.enter:
                    onEnterClick(this.state.value);
                    break;

                default:
                    return;
            }
        } 

        // We only get here if the keypress has been handled.
        ev.preventDefault();
        ev.stopPropagation();
    }
}
