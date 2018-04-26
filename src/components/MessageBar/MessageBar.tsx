import * as React from 'react';
import * as classNames from 'classnames';
import { IMessageBarProps, MessageBarType } from './MessageBar.Props';
import { getId } from '../../utilities/getId';
import { Icon } from '../../components/Icon/Icon';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import './MessageBar.scss';

export interface IMessageBarState {
    labelId?: string;
}

export class MessageBar extends React.Component<IMessageBarProps, IMessageBarState> {
    public static defaultProps: IMessageBarProps = {
        messageBarType: MessageBarType.info,
        onDismiss: null,
        hasDontShowAgain: false,
        dontShowAgainChecked: false
    };

    private ICON_MAP = {
        [MessageBarType.info]: 'icon-info',
        [MessageBarType.warning]: 'icon-warning',
        [MessageBarType.error]: 'icon-delete',
        [MessageBarType.success]: 'icon-checkmark'
    };

    constructor(props: IMessageBarProps) {
        super(props);

        this.state = {
            labelId: getId('messageBar')
        };
    }

    public render(): JSX.Element {
        let { hasDontShowAgain, dontShowAgainChecked, dontShowAgainClicked } = this.props;

        const messageBarClassName = classNames(
            'messageBar',
            'messageBar-singleline',
            
            [this.props.className],
            {
                'messageBar-info': this.props.messageBarType === MessageBarType.info,
                'messageBar-error': this.props.messageBarType === MessageBarType.error,
                'messageBar-success': this.props.messageBarType === MessageBarType.success,
                'messageBar-warning': this.props.messageBarType === MessageBarType.warning,
                'expandable': !!this.props.expandOnHover
            }
        );

        let tooltip;
        if (typeof this.props.children === 'string' && !this.props.expandOnHover) {
            tooltip = this.props.children;
        }
        return (
            <div className={messageBarClassName} role="status">
                <div className={'messageBar-content'}>
                    {this._getIconSpan()}
                    <div className={'messageBar-actionables'}>
                        <div className={'messageBar-text'} id={this.state.labelId}>
                            <span className={this._getInnerTextClassName()} title={tooltip}>
                                {this.props.children}
                            </span>
                        </div>
                        {this._getActionsDiv()}
                        {this._getDontShowAgainDiv()}
                        {this._getDismissDiv()}
                    </div>
                </div>
            </div>
        );
    }

    private _getIconSpan(): JSX.Element {
        return (
            <div className={'messageBar-icon'}>
                <Icon iconName={this.ICON_MAP[this.props.messageBarType]}></Icon>
            </div>
        );
    }

    private _getInnerTextClassName(): string {
        return 'messageBar-innerText';
    }

    private _getActionsDiv(): JSX.Element {
        if (this.props.actions) {
            return (
                <div className={'messageBar-actionsOneline'}>
                    {this.props.actions}
                </div>
            );
        }
        return null;
    }

    private _getDismissDiv(): JSX.Element {
        if (this.props.onDismiss != null) {
            return (
                <Icon
                    disabled={false}
                    className={'messageBar-dismissal'}
                    onClick={this.props.onDismiss}
                    iconName={'icon-delete'} />
            );
        }
        return null;
    }

    private _getDontShowAgainDiv(): JSX.Element {
        let { hasDontShowAgain, dontShowAgainChecked, dontShowAgainClicked } = this.props;

        if (this.props.hasDontShowAgain != null && this.props.hasDontShowAgain) {
            return (
                <div className="messageBar-checkBox-container"><Checkbox className={'messageBar-checkbox'} checked={this.props.dontShowAgainChecked} label={'Don\'t show this message again'} onChange={this.props.dontShowAgainClicked}></Checkbox></div>
            );
        }

        return null;
    }
}
