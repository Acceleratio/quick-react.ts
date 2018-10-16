import * as React from 'react';
import * as classNames from 'classnames';
import { ILeftNavigationProps, ILeftNavigationOption, ExpandCaptionsBehaviorEnum, LeftNavigationOptionPositionEnum } from './LeftNavigation.Props';
import { assign } from '../../utilities/object';
import { findIndex } from '../../utilities/array';
import { Icon } from '../../components/Icon/Icon';
import { CommonComponent } from '../Common/Common';
import { elementContains } from '../../utilities/elementContains';
import { getWindow } from '../../utilities/getDocument';
import { autobind } from '../../utilities/autobind';
import './LeftNavigation.scss';
import { nullFunc } from '../../utilities/common';
import { NotificationIcon } from '../NotificationIcon/NotificationIcon';

export class LeftNavigation extends CommonComponent<ILeftNavigationProps, any> {
    private _targetWindow: Window;
    private _leftNavElement: HTMLDivElement;
    private _target: HTMLElement | MouseEvent;
    private timer = null;

    public static defaultProps: Partial<ILeftNavigationProps> = {
        expandCaptionsBehavior: ExpandCaptionsBehaviorEnum.ShowCaptionsOnHover,
        onClick: nullFunc
    };

    constructor(props: ILeftNavigationProps) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    public componentDidMount() {
        let target = this._leftNavElement;
        this.setTargetWindowAndElement(target);
        this._events.on(this._targetWindow, 'click', this.dismissOnClickOutsideComponent, true);
    }

    public componentWillUnmount() {
        this._events.dispose();
    }

    private setTargetWindowAndElement(target: HTMLElement): void {
        if (target) {
            let targetElement: HTMLElement = target as HTMLElement;
            this._target = target;
            this._targetWindow = getWindow(targetElement);
        } else {
            this._targetWindow = getWindow();
        }
    }

    public componentWillReceiveProps(newProps: ILeftNavigationProps) {
        this.setState({ selectedId: this.getSelectedId(newProps.options) });
    }

    protected dismissOnClickOutsideComponent(ev: Event) {
        let target = ev.target as HTMLElement;
        if (ev.target !== this._targetWindow && (!this._target || !elementContains(this._target as HTMLElement, target, false))) {
            this.setState({ isOpen: false });
        }
    }

    private onLinkClick(id, item: any, ev: React.MouseEvent<HTMLElement>) {
        if (this.state.isOpen) {
            this.setState({ isOpen: false });
        }
        this.props.onClick(ev, item);
    }

    private getSelectedId(options: Array<ILeftNavigationOption>): string {
        const selectedOptions = options.filter(option => { return option.selected ? option.id : null; });

        if (selectedOptions.length > 0) {
            return selectedOptions[0].id;
        }

        return '';
    }

    @autobind
    private setNavigationReference(ref: HTMLDivElement) {
        this._leftNavElement = ref;
    }

    @autobind
    private onNavigationMouseOut() {
        if (this.props.expandCaptionsBehavior === ExpandCaptionsBehaviorEnum.ShowCaptionsOnHover && this.state.isOpen) {
            this.setState({ isOpen: false });
        }
    }

    @autobind
    private onNavigationMouseOver() {
        if (this.timer !== null || this.props.expandCaptionsBehavior !== ExpandCaptionsBehaviorEnum.ShowCaptionsOnHover || this.state.isOpen) {
            return;
        }
        if (this.props.expandDelayMs) {
            this.timer = setTimeout(() => this.setNavigationOpenState(), this.props.expandDelayMs);
        } else {
            this.setNavigationOpenState();
        }
    }

    @autobind
    private setNavigationOpenState() {
        this.setState({ isOpen: !this.state.isOpen });

        this.timer = null;
    }

    private _getOptionDetails(options: Array<ILeftNavigationOption>) {
        const childrenItems = options.map((option, index) => {
            const linkClasses = classNames(
                'nav-item',
                {
                    'disabled': option.disabled,
                    'selected': option.selected
                });

            const spanClasses = classNames({ 'with-notification': option.notificationNumber !== undefined });

            return (
                <div
                    key={option.id}
                    className={linkClasses}
                    title={option.text}
                    onClick={(ev) => this.onLinkClick(option.id, option, ev)}
                >
                    <a id={option.id}>
                        {(option.notificationNumber) ?
                            <NotificationIcon iconName={option.icon} notificationNumber={option.notificationNumber}
                                notificationBubbleStyleObject={this.props.notificationBubbleStyleObject} />
                            : <Icon iconName={option.icon} />}
                        <span className={spanClasses} >{option.text}</span>
                    </a>
                </div>
            );
        });

        return childrenItems;
    }

    private _renderBody() {
        let leftNavigationTextClass = classNames({
            'show-text': this.state.isOpen,
            'hide-text': !this.state.isOpen
        });

        const className = classNames(
            'left-nav',
            {
                'expanded': this.state.isOpen,
                'collapsed': !this.state.isOpen && !this.props.expandMargin,
                'collapsed-margin': !this.state.isOpen && this.props.expandMargin
            }, [this.props.className]);

        let upOptions = [];
        let downOptions = [];

        this.props.options.forEach(option => {
            option.position === LeftNavigationOptionPositionEnum.Down ? downOptions.push(option) : upOptions.push(option);
        });

        return (
            <div
                className={className}
                ref={this.setNavigationReference}
                onMouseEnter={this.onNavigationMouseOver}
                onMouseLeave={this.onNavigationMouseOut}
            >
                <div>
                    {this.props.expandCaptionsBehavior === ExpandCaptionsBehaviorEnum.ShowCaptionsOnToggleButton &&
                        <div className="nav-item" onClick={this.setNavigationOpenState}>
                            <Icon iconName={'icon-switchView'} />
                        </div>
                    }
                    <div className="up-options">{this._getOptionDetails(upOptions)}</div>
                    <div className="down-options">{this._getOptionDetails(downOptions)}</div>
                </div>
            </div>
        );
    }

    public render(): JSX.Element {
        return (
            this.props.expandMargin ? (
                <div className="left-nav left-nav-container">
                    {this._renderBody()}
                </div>
            ) : (this._renderBody())
        );
    }
}
