import * as React from 'react';
import * as classNames from 'classnames';
import { IPeoplePickerProps } from './PeoplePicker.Props';
import { getId } from '../../utilities/getId';
import { autobind } from '../../utilities/autobind';
import './PeoplePicker.scss';
import { Principal } from './Principal';
import { Label } from './../../../src/components/Label/Label';
import { IPrincipal } from './Principal.Props';
import { Spinner } from '../Spinner/Spinner';
import { SpinnerType } from '../Spinner/Spinner.Props';
import { Tooltip } from '../Tooltip/Tooltip';
import { DirectionalHint } from '../../utilities/DirectionalHint';
import { Icon } from '../Icon/Icon';

export interface IPeoplePickerState {
    errorMessage?: string;
    isFocused?: boolean;
    selectedPrincipalList?: IPrincipal[];
    suggestionsVisible?: boolean;
    value?: any;
}

export class PeoplePicker extends React.PureComponent<IPeoplePickerProps, IPeoplePickerState> {
    private _field;

    constructor(props) {
        super(props);

        this.state = {
            errorMessage: '',
            isFocused: false,
            selectedPrincipalList: null,
            suggestionsVisible: false,
            value: props.value || props.defaultValue || ''
        };

        this._onInputChange = this._onInputChange.bind(this);
    }

    private _onInputChange(event: React.ChangeEvent<any>): void {
        const element: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        const value: any = element.value;

        this.setState({
            value: value
        });

        if (value.length >= 3) {
            this.setState({ suggestionsVisible: true });
            this.props.onSearch(value);
        } else {
            this.setState({ suggestionsVisible: false });
        }
    }

    private _renderSuggestions(): JSX.Element {
        return (
            <div className="people-picker-suggestions">
                {this.props.loadingSuggestionList && <Spinner type={SpinnerType.small} />}
                {!this.props.loadingSuggestionList && this.props.suggestionList.map((principal, index) => (
                    <Principal
                        iconName={this.props.iconName}
                        principal={principal}
                        isSelected={false}
                        onSelect={this._onSuggestionClick}
                    />
                ))}
            </div>
        );
    }

    @autobind
    private _onSuggestionClick(principal: IPrincipal) {
        this.setState({ suggestionsVisible: false, value: '' });

        if (this.state.selectedPrincipalList !== null) {
            this.setState({ selectedPrincipalList: [...this.state.selectedPrincipalList, principal] });
        } else {
            this.setState({ selectedPrincipalList: [principal] });
        }
    }

    @autobind
    private _renderEmptyField(): JSX.Element {
        const peoplePickerInputClassName = classNames(
            'people-picker-input',
            {
                'is-disabled': this.props.disabled
            },
            [this.props.className]
        );

        return (
            <input
                type={'text'}
                ref={(c): HTMLInputElement => this._field = c}
                value={this.state.value}
                onBlur={this._onBlur}
                onFocus={this._onFocus}
                onChange={this._onInputChange}
                className={peoplePickerInputClassName}
                placeholder={this.props.placeholder}
            />
        );
    }

    @autobind
    private _renderSelectedPrincipal(): JSX.Element {
        this.props.onSelect(this.state.selectedPrincipalList);

        const peoplePickerSelectedClassName = classNames(
            'people-picker-selected',
            {
                'is-active': this.state.isFocused
            },
            [this.props.className]
        );

        if (this.props.singleSelect) {
            return (
                <div>
                    {this.state.selectedPrincipalList && this.state.selectedPrincipalList.map((principal, index) => (
                        <Principal
                            iconName={this.props.iconName}
                            principal={principal}
                            isSelected={true}
                            onDelete={() => this._onSuggestionDelete(principal.id)}
                        />
                    ))}
                </div>
            );
        } else {
            return (
                <div className={peoplePickerSelectedClassName}>
                    {this.state.selectedPrincipalList && this.state.selectedPrincipalList.map((principal, index) => (
                        <Principal
                            iconName={this.props.iconName}
                            principal={principal}
                            isSelected={true}
                            onDelete={() => this._onSuggestionDelete(principal.id)}
                        />
                    ))}
                    <input
                        type={'text'}
                        ref={(c): HTMLInputElement => this._field = c}
                        value={this.state.value}
                        onChange={this._onInputChange}
                        onFocus={this._onFocus}
                        onBlur={this._onBlur}
                        className="people-picker-selected-input"
                        onKeyDown={this._handleOnKeyDown}
                    />
                </div>
            );
        }
    }

    @autobind
    private _handleOnKeyDown(event: React.KeyboardEvent<any>): void {
        if (event.key === 'Backspace') {
            if (this.state.value.length === 0) {
                this._onSuggestionDeleteLast();
            }
        }
    }

    @autobind
    private _onSuggestionDelete(principalId: number) {
        const newPrincipalList = this.state.selectedPrincipalList.filter((principal, index) => {
            if (principal.id !== principalId) {
                return principal;
            }
        });
        this.setState({ selectedPrincipalList: newPrincipalList });
    }

    @autobind
    private _onSuggestionDeleteLast() {
        const oldPrincipalList = this.state.selectedPrincipalList;
        this.setState({ selectedPrincipalList: oldPrincipalList.slice(0, oldPrincipalList.length - 1) });
    }

    @autobind
    private _onFocus(ev: React.FocusEvent<any>) {
        this.setState({
            isFocused: true
        });
    }

    @autobind
    private _onBlur(ev: React.FocusEvent<any>) {
        this.setState({
            isFocused: false
        });
    }

    public render() {
        let { disabled, className } = this.props;

        const peoplePickerClassName = classNames(
            'people-picker',
            {
                'is-disabled': disabled
            },
            [this.props.className]
        );

        return (
            <div className={peoplePickerClassName}>
                {this.props.labelText && <Label >{this.props.labelText}</Label>}
                {this.state.selectedPrincipalList === null && this._renderEmptyField()}
                {this.state.selectedPrincipalList !== null && this.state.selectedPrincipalList.length > 0 && this._renderSelectedPrincipal()}
                {this.state.selectedPrincipalList !== null && this.state.selectedPrincipalList.length === 0 && this._renderEmptyField()}
                {this.state.suggestionsVisible && this._renderSuggestions()}
            </div>
        );
    }
}
