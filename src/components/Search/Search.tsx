import * as React from 'react';
import * as classNames from 'classnames';
import { ISearchProps } from './Search.Props';
import { getId } from '../../utilities/getId';
import { autobind } from '../../utilities/autobind';
import { CommonComponent } from '../Common/Common';
import { KeyCodes } from '../../utilities/KeyCodes';
import { Icon } from '../../components/Icon/Icon';
import { getDocument } from '../../utilities/getDocument';
import { getWindow } from '../../utilities/getDocument';
import { elementContains } from '../../utilities/elementContains';
import * as _ from 'lodash';
import './Search.scss';
import { Button } from '../Button/Button';
import { getNativeAttributes, inputAttributes } from '../../utilities/attributes';

export interface ISearchState {
    value?: string;
    hasFocus?: boolean;
    id?: string;
}

export class Search extends CommonComponent<ISearchProps, ISearchState> {
    public static defaultProps: ISearchProps = {
        labelText: 'Search',
        debounceWaitMs: 200
    };

    private _rootElement: HTMLElement;
    private _inputElement: HTMLInputElement;
    private _targetWindow: Window;

    public constructor(props: ISearchProps) {
        super(props);
        this._callOnChange = _.debounce(this._callOnChange, props.debounceWaitMs);
        this.state = {
            value: props.value || '',
            hasFocus: false,
            id: getId('search')
        };
    }

    public componentWillReceiveProps(newProps: ISearchProps) {
        if (newProps.value !== undefined) {
            this.setState({
                value: newProps.value
            });
        }
    }

    public componentDidMount() {
        this._setTargetWindowAndElement(this._rootElement);
        this._events.on(this._targetWindow, 'click', this._removeFocus);
    }

    @autobind
    private _removeFocus(ev: Event) {
        const target = ev.target as HTMLElement;

        if (ev.target !== this._targetWindow && (!this._inputElement || !elementContains(this._inputElement as HTMLElement, target, false))) {
            this.setState({
                hasFocus: false
            });
        }
    }

    public componentWillUnmount() {
        this._events.dispose();
    }

    private _setTargetWindowAndElement(target: HTMLElement): void {
        if (target) {
            let targetElement: HTMLElement = target as HTMLElement;
            this._targetWindow = getWindow(targetElement);
        } else {
            this._targetWindow = getWindow();
        }
    }

    public render(): React.ReactElement<React.HTMLProps<HTMLInputElement>> {
        let { labelText, disabled, className, underlined } = this.props;
        let { value, hasFocus, id } = this.state;

        const searchClassName = classNames(
            'search',
            className,
            {
                'is-active': hasFocus,
                'can-clear': value.length > 0,
                'is-disabled': disabled,
                'is-underlined': underlined
            }
        );

        let inputProps = getNativeAttributes<React.HTMLProps<HTMLInputElement>>(this.props, inputAttributes, ['defaultValue']);

        return (
            <div
                ref={this._resolveRef('_rootElement')}
                className={searchClassName}
                {...{ onFocusCapture: this._onFocusCapture }}>
                {!underlined &&
                    <Icon className={'search-icon'} iconName={'icon-search'}></Icon>
                }
                <input
                    {...inputProps}
                    id={id}
                    className={'search-field'}
                    value={value}
                    placeholder={labelText}
                    onChange={this._onInputChange}
                    onKeyDown={this._onKeyDown}
                    disabled={disabled}
                    ref={this._resolveRef('_inputElement')}
                    title={value} />
                <div
                    className={'search-clearButton'}
                    onClick={this._onClearClick}>
                    <Icon iconName={'icon-delete'}></Icon>
                </div>
                {underlined &&
                    <div className="search-button">
                        <Button disabled={disabled} className={'button-primary'} icon={'icon-search'} onClick={this._onSearchClick}></Button>
                    </div>
                }
            </div>
        );
    }

    @autobind
    private _onClearClick(ev?: any) {
        this.setState({
            value: ''
        });

        this._callOnChange('');
        ev.stopPropagation();
        ev.preventDefault();

        this._inputElement.focus();
    }

    @autobind
    private _onFocusCapture(ev: React.FocusEvent<HTMLElement>) {
        this.setState({
            hasFocus: true
        });

        this._events.on(getDocument().body, 'focus', this._handleDocumentFocus, true);
    }

    @autobind
    private _onSearchClick() {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.value);
        }
    }

    @autobind
    private _onKeyDown(ev: React.KeyboardEvent<HTMLElement>) {
        switch (ev.which) {

            case KeyCodes.escape:
                this._onClearClick(ev);
                break;

            case KeyCodes.enter:
                if (this.props.onSearch) {
                    this.props.onSearch(this.state.value);
                }
                break;

            default:
                return;
        }

        // We only get here if the keypress has been handled.
        ev.preventDefault();
        ev.stopPropagation();
    }

    @autobind
    private _onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            value: this._inputElement.value
        });
        this._callOnChange(this._inputElement.value);
    }

    private _handleDocumentFocus(ev: FocusEvent) {
        if (!elementContains(this._rootElement, ev.target as HTMLElement)) {
            this._events.off(getDocument().body, 'focus');
            this.setState({
                hasFocus: false
            });
        }
    }

    private _callOnChange(newValue: string): void {
        // Handle deprecated prop        
        let onChange = (this.props.onChanged) ? this.props.onChanged : this.props.onChange;
        if (onChange) {
            onChange(newValue);
        }
    }
}
