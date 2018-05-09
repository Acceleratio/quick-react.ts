import * as React from 'react';
import * as classNames from 'classnames';
import { IPrincipalProps, IPrincipal, PrincipalType } from './Principal.Props';
import { getId } from '../../utilities/getId';
import { autobind } from '../../utilities/autobind';
import './Principal.scss';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import { DirectionalHint } from '../../utilities/DirectionalHint';

export interface IPrincipalState {
    showTooltip?: boolean;
}

export class Principal extends React.PureComponent<IPrincipalProps, IPrincipalState> {
    private _field;
    constructor(props) {
        super(props);

        this.state = {
            showTooltip: false
        };
    }

    @autobind
    private _onClickPrincipal(): void {
        if (this.props.onSelect) {
            this.props.onSelect(this.props.principal);
        }
    }

    @autobind
    private _onClickDelete(): void {
        this.props.onDelete(this.props.principal);
    }

    @autobind
    private _onMouseOver(): void {
        this.setState({ showTooltip: true });
        if (this.props.onMouseOver && this.props.principal) {
            this.props.onMouseOver(this.props.principal.identifier);
        }
    }

    @autobind
    private _onMouseOut(): void {
        this.setState({ showTooltip: false });
    }

    @autobind
    private _getIconDetails() {
        switch (this.props.principal.type) {
            case PrincipalType.user:
                return {
                    iconName: 'icon-user',
                    className: 'principal-user-icon'
                };
            case PrincipalType.securityGroup:
                return {
                    iconName: 'icon-group',
                    className: 'principal-security-group-icon'
                };
            case PrincipalType.sharePointGroup:
                return {
                    iconName: 'icon-group',
                    className: 'principal-share-point-group-icon'
                };
            case PrincipalType.activeDirectoryGroup:
                return {
                    iconName: 'icon-group',
                    className: 'principal-active-directory-group-icon'
                };
        }
    }

    @autobind
    private _getTooltipContent(): string {
        const { email, displayIdentifier, type } = this.props.principal;
        if (email) {
            if (displayIdentifier && email.toLowerCase() === displayIdentifier.toLowerCase() || !displayIdentifier || type !== PrincipalType.user) {
                return email;
            } else if (displayIdentifier && type === PrincipalType.user) {
                return `Email: ${email}\r\nUsername: ${displayIdentifier}`;
            }
        } else if (displayIdentifier && type === PrincipalType.user) {
            return displayIdentifier;
        }

        return null;
    }

    @autobind
    private _ref(value: HTMLElement) {
        this._field = value;
    }

    public componentWillUnmount() {
        if (this.props.onWillUnmount && this.props.principal) {
            this.props.onWillUnmount(this.props.principal.identifier);
        }
    }

    @autobind
    public focus(): void {
        if (this._field === undefined || this._field === null) {
            return;
        }
        this._field.focus();
    }

    public render() {
        const tooltip = this._getTooltipContent();

        const className = classNames(this.props.isSelected ? 'principal-container-selected' : 'principal-container-suggested', 
        {'hovered': this.props.isFocused});

        return (
            <span className={className} onClick={this._onClickPrincipal}
                onMouseOver={this._onMouseOver}
                onMouseOut={this._onMouseOut} 
                ref={this._ref}
                tabIndex={-1}
                >
                {this.props.iconName &&
                    <Icon iconName={this.props.iconName} className={this.props.iconClassName} ></Icon>
                }
                <span>
                    {this.props.principal.displayName}
                </span>
                {this.props.isSelected && !this.props.isDisabled &&
                    <Icon
                        iconName="icon-delete"
                        className="principal-delete-icon"
                        onClick={this._onClickDelete}
                    />
                }
                {tooltip && <Tooltip
                    className="tooltip-white"
                    content={tooltip}
                    directionalHint={DirectionalHint.topCenter}
                    showTooltip={this.state.showTooltip}
                />}
            </span>
        );
    }
}
