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

    public render() {
        let iconDetails: {
            iconName: string,
            className: string
        };

        iconDetails = this._getIconDetails();

        return (
            <span className="principal-container" onClick={this._onClickPrincipal}
                onMouseOver={this._onMouseOver}
                onMouseOut={this._onMouseOut} >
                <Icon iconName={iconDetails.iconName} className={iconDetails.className} ></Icon>
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
                {this.props.principal.email && <Tooltip
                    className="tooltip-white"
                    content={this.props.principal.email}
                    directionalHint={DirectionalHint.topCenter}
                    showTooltip={this.state.showTooltip}
                />}
            </span>
        );
    }
}
