import * as React from 'react';
import * as classNames from 'classnames';
import { IButtonProps, IButton } from './Button.Props';
import { getNativeAttributes, buttonAttributes, anchorAttributes } from '../../utilities/attributes';
import { assign } from '../../utilities/object';
import { Icon } from '../Icon/Icon';
import './Button.scss';
import { SpinnerType } from '../Spinner/Spinner.Props';
import { Spinner } from '../Spinner/Spinner';
import * as ReactDOM from 'react-dom';

export class Button extends React.Component<IButtonProps, any> implements IButton {

    private _buttonElement: HTMLButtonElement;
    constructor(props: IButtonProps) {
        super(props);
        this.state = {};
    }


    public componentWillUpdate(nextProps: IButtonProps, nextState: any) {
        if (!this.props.isLoading && nextProps.isLoading && this.props.isSuccess === undefined) {
            this.setState({ widthToUseWhileShowingActionState: this._buttonElement.offsetWidth });
        }
    }

    public render(): JSX.Element {
        let {
            children,
            icon,
            description,
            ariaLabel,
            ariaDescription,
            href,
            disabled,
            onClick,
            isVisible,
            isLoading,
            isSuccess
        } = this.props;

        const isShowingActionState = isLoading || isSuccess !== undefined;

        let actionStateClassName;
        if (isShowingActionState) {
            if (isLoading) {
                icon = undefined;
                actionStateClassName = 'button-loading';
            } else if (isSuccess) {
                actionStateClassName = 'button-succes';
                icon = 'icon-checkmark';
            } else if (isSuccess !== undefined) {
                actionStateClassName = 'button-error';
                icon = 'icon-error';
            }

            children = undefined;
        }

        const renderAsAnchor: boolean = !!href;
        const tag = renderAsAnchor
            ? 'a'
            : 'button';

        const nativeProps = getNativeAttributes(this.props, renderAsAnchor
            ? anchorAttributes
            : buttonAttributes);

        const className = classNames({
            'button': !renderAsAnchor,
            'button-icon-text': icon !== undefined && children !== undefined,
            'button-icon': icon !== undefined && children === undefined && !isShowingActionState,
            'link': renderAsAnchor,
            'disabled-link': disabled && renderAsAnchor,
            'hide-button': isVisible === false,
            'button-primary': this.props.className === undefined && !renderAsAnchor
        }, [this.props.className, actionStateClassName]);

        const iconElement = icon
            ? <Icon iconName={icon}></Icon>
            : null;

        const spinner = isLoading
            ? <Spinner type={SpinnerType.small} />
            : null;

        let style;
        if (this.props.width) {
            style = { style: { width: this.props.width } };
        } else if (isShowingActionState && this.state.widthToUseWhileShowingActionState) {
            style = { style: { width: this.state.widthToUseWhileShowingActionState } };
        }

        return React.createElement(
            tag,
            assign(
                {},
                nativeProps,
                href ? { href } : null,
                { 'ref': (c: HTMLButtonElement): HTMLButtonElement => this._buttonElement = c },
                onClick && { 'onClick': onClick },
                disabled && { 'disabled': disabled },
                { className },
                style
            ),
            iconElement,
            spinner,
            children && <span className="button-label">{children}</span>
        );
    }
    public focus(): void {
        if (this._buttonElement) { this._buttonElement.focus(); }
    }
}
