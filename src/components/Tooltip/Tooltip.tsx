import * as React from 'react';
import * as classNames from 'classnames';
import { ITooltipProps } from './Tooltip.props';
import { Callout } from '../Callout';
import { DirectionalHint } from '../../utilities/DirectionalHint';
import { CommonComponent } from '../Common/Common';
import { autobind } from '../../utilities/autobind';
import './Tooltip.scss';

export class Tooltip extends CommonComponent<ITooltipProps, any> {
    private _tooltipHost: HTMLElement;

    public timer = null;

    public static defaultProps = {
        directionalHint: DirectionalHint.bottomCenter,
        delayMs: 300,
        onTooltipToggle: (isTooltipVisible: boolean) => { }
    };

    constructor(props: ITooltipProps) {
        super(props);

        this.state = {
            isTooltipVisible: props.showTooltip || false
        };
    }

    public componentWillReceiveProps(newProps: ITooltipProps) {
        if (newProps.showTooltip !== undefined) {
            this.setState({
                isTooltipVisible: newProps.showTooltip
            });
        }
    }

    public componentWillUnmount() {
        if (this.timer && this.timer !== null) {
            clearTimeout(this.timer);
        }
    }

    public render() {
        let { className, targetElement, directionalHint, content, children, title } = this.props;

        const tooltipClassName = classNames(
            'tooltip-callout',
            [this.props.className],
            {
                'tooltip-gray': this.props.className === undefined
            }
        );

        const tooltipContainerClass = classNames('tooltip-container', [this.props.containerClass]);

        return (
            <div
                ref={this._resolveRef('_tooltipHost')}
                { ...{ onFocusCapture: this._onTooltipMouseEnter } }
                { ...{ onBlurCapture: this._onTooltipMouseLeave } }
                onMouseEnter={this._onTooltipMouseEnter}
                onMouseLeave={this._onTooltipMouseLeave}
                className={tooltipContainerClass}>

                {children}

                {this.state.isTooltipVisible &&
                    <Callout
                        target={this._getTargetElement()}
                        directionalHint={directionalHint}
                        className={tooltipClassName}
                        isBeakVisible={true}
                        gapSpace={0}>
                        <div className="tooltip-content" role="tooltip">
                            {title &&
                                <div>
                                    <span className="tooltip-title">{title}</span>
                                </div>
                            }
                            <span>{content}</span>
                        </div>
                    </Callout>
                }
            </div>
        );
    }

    private _getTargetElement(): HTMLElement {
        return this._tooltipHost;
    }

    // Show Tooltip
    @autobind
    private _onTooltipMouseEnter(ev: any) {
        if (this.timer !== null) {
            return;
        }
        this.timer = setTimeout(() => this._toggleTooltip(true), this.props.delayMs);
    }

    // Hide Tooltip
    @autobind
    private _onTooltipMouseLeave(ev: any) {
        if (this.props.showTooltip === undefined || !this.props.showTooltip) {
            if (this.timer && this.timer !== null) {
                clearTimeout(this.timer);
            }

            this._toggleTooltip(false);
        }
    }

    // Hide Tooltip
    @autobind
    private _onTooltipCallOutDismiss() {
        if (this.props.showTooltip === undefined || !this.props.showTooltip) {
            this._toggleTooltip(false);
        }
    }

    @autobind
    private _toggleTooltip(isTooltipVisible: boolean) {
        let showTooltipProp = this.props.showTooltip !== undefined ? this.props.showTooltip : true;

        this.setState({
            isTooltipVisible: showTooltipProp && isTooltipVisible
        }, () => this.props.onTooltipToggle(this.state.isTooltipVisible));

        this.timer = null;
    }
}
