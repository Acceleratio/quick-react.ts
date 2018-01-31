import * as React from 'react';
import * as classNames from 'classnames';
import { IPeoplePickerProps } from './PeoplePicker.Props';
import { autobind } from '../../utilities/autobind';
import './PeoplePicker.scss';
import { Principal } from './Principal';
import { Label } from '../Label/Label';
import { IPrincipal } from './Principal.Props';
import { Spinner } from '../Spinner/Spinner';
import { SpinnerType } from '../Spinner/Spinner.Props';
import { Tooltip } from '../Tooltip/Tooltip';
import { DirectionalHint } from '../../utilities/DirectionalHint';
import { Icon } from '../Icon/Icon';
import * as _ from 'lodash';

export interface IPeoplePickerState {
    isFocused?: boolean;
    selectedPrincipalList?: IPrincipal[];
    suggestionsVisible?: boolean;
    value?: any;
}

export class PeoplePicker extends React.PureComponent<IPeoplePickerProps, IPeoplePickerState> {
    private _field;
    private _delayedSearch;

    constructor(props) {
        super(props);

        this.state = {
            isFocused: false,
            selectedPrincipalList: [],
            suggestionsVisible: false,
            value: props.value || props.defaultValue || ''
        };

        if (this.props.selectedPrincipalList) {
            this.state.selectedPrincipalList.push(...this.props.selectedPrincipalList);
        }

        this._delayedSearch = _.debounce(this._onSearch, 800);
    }

    @autobind
    private _onInputChange(event: React.ChangeEvent<any>): void {
        const element: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        const value: any = element.value;

        this.setState({
            value: value
        });

        this._delayedSearch(value);
    }

    @autobind
    private _onSearch(value: string) {
        if (value.length >= 3) {
            this.setState({ suggestionsVisible: true });
            this.props.onSearch(value);
        } else {
            this.setState({ suggestionsVisible: false });
        }
    }

    @autobind
    private _renderSuggestions(): JSX.Element {
        return (
            <div className="people-picker-suggestions">
                {this.props.loadingSuggestionList && <Spinner type={SpinnerType.small} />}
                {!this.props.loadingSuggestionList && this.props.suggestionList.map((principal, index) => {
                    const alreadySelected = this.state.selectedPrincipalList 
                        && this.state.selectedPrincipalList.find(selected => selected.identifier === principal.identifier) !== undefined;

                    return !alreadySelected && <Principal
                        key={principal.identifier}
                        principal={principal}
                        isSelected={false}
                        onSelect={this._onSuggestionClick}
                    />;
                })}
            </div>
        );
    }

    @autobind
    private _onSuggestionClick(principal: IPrincipal) {
        this.setState({ suggestionsVisible: false, value: '' });

        if (this.state.selectedPrincipalList !== null) {
            if (!this.state.selectedPrincipalList.find(x => x.identifier === principal.identifier)) {
                this.setState({ selectedPrincipalList: [...this.state.selectedPrincipalList, principal] }, this._onUpdateSelection);
            }
        } else {
            this.setState({ selectedPrincipalList: [principal] }, this._onUpdateSelection);
        }
    }

    @autobind
    private _ref(value: HTMLInputElement) {
        this._field = value;
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

        if (!this.props.errorMessage) {
            return (
                <input
                    type={'text'}
                    ref={this._ref}
                    value={this.state.value}
                    onBlur={this._onBlur}
                    onFocus={this._onFocus}
                    onChange={this._onInputChange}
                    className={peoplePickerInputClassName}
                    placeholder={this.props.placeholder}
                />
            );
        }

        return (
            <div className="people-picker-input-error-container">
                <Tooltip
                    content={this.props.errorMessage}
                    className="tooltip-error"
                    showTooltip={this.state.isFocused}
                    directionalHint={DirectionalHint.topLeftEdge}>
                    <div className="people-picker-input-error-content">
                        <input
                            type={'text'}
                            ref={this._ref}
                            value={this.state.value}
                            onBlur={this._onBlur}
                            onFocus={this._onFocus}
                            onChange={this._onInputChange}
                            className="people-picker-input-error"
                            placeholder={this.props.placeholder}
                        />
                        <Icon iconName="icon-warning2" className="people-picker-error-icon"></Icon>
                    </div>
                </Tooltip>
            </div>
        );
    }

    @autobind
    private _renderSelectedPrincipal(): JSX.Element {
        const peoplePickerSelectedClassName = classNames(
            'people-picker-selected',
            {
                'is-active': this.state.isFocused
            },
            [this.props.className]
        );

        let selectedPrincipalList = this.state.selectedPrincipalList.map((principal, index) => (
            <Principal
                principal={principal}
                isSelected={true}
                onDelete={this._onSuggestionDelete}
            />
        ));

        if (this.props.singleSelect) {
            return (
                <div className="people-picker-single-selected">
                    {this.state.selectedPrincipalList && selectedPrincipalList}
                </div>
            );
        } else {
            return (
                <div className={peoplePickerSelectedClassName}>
                    {this.state.selectedPrincipalList && selectedPrincipalList}
                    <input
                        type={'text'}
                        ref={this._ref}
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
    private _onSuggestionDelete(selectedPrincipal: IPrincipal) {
        const newPrincipalList = this.state.selectedPrincipalList.filter((principal, index) => {
            if (principal.identifier !== selectedPrincipal.identifier) {
                return principal;
            }
        });
        this.setState({ selectedPrincipalList: newPrincipalList }, this._onUpdateSelection);
    }

    @autobind
    private _onSuggestionDeleteLast() {
        const oldPrincipalList = this.state.selectedPrincipalList;
        this.setState({ selectedPrincipalList: oldPrincipalList.slice(0, oldPrincipalList.length - 1) }, this._onUpdateSelection);
    }

    @autobind
    private _onFocus(ev: React.FocusEvent<any>) {
        this.setState({ isFocused: true });
    }

    @autobind
    private _onBlur(ev: React.FocusEvent<any>) {
        this.setState({ isFocused: false });
    }

    @autobind
    private _onUpdateSelection() {
        this.props.onSelect(this.state.selectedPrincipalList);
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
