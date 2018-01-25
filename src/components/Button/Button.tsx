import * as React from 'react';
import * as classNames from 'classnames';
import { IButtonProps, IButton } from './Button.Props';
import { getNativeAttributes, buttonAttributes, anchorAttributes } from '../../utilities/attributes';
import { assign } from '../../utilities/object';
import { Icon } from '../Icon/Icon';
import './Button.scss';
import { SpinnerType } from '../Spinner/Spinner.Props';
import { Spinner } from '../Spinner/Spinner';

export class Button extends React.Component<IButtonProps, any> implements IButton {

    private _buttonElement: HTMLButtonElement;
    constructor(props: IButtonProps) {
        super(props);
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
            isLoading
        } = this.props;

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
            'button-icon': icon !== undefined && children === undefined,
            'link': renderAsAnchor,
            'disabled-link': disabled && renderAsAnchor,
            'hide-button': isVisible === false,
            'button-primary': this.props.className === undefined && !renderAsAnchor
        }, [this.props.className]);

        const iconElement = icon
            ? <Icon iconName={icon}></Icon>
            : null;

        const spinner = isLoading
            ? <Spinner type={SpinnerType.small} />
            : null;

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
                this.props.width !== undefined && { style: { width: this.props.width } }
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
