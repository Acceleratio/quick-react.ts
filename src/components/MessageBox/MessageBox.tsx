import * as React from 'react';
import { Dialog } from '../Dialog/Dialog';
import * as classNames from 'classnames';
import { DialogFooter } from '../Dialog/DialogFooter';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Spinner } from '../Spinner/Spinner';
import { MessageLevel, IMessageBoxProps, IMessageBoxButton } from './MessageBox.Props';
import { DirectionalHint } from '../../utilities/DirectionalHint';
import { Tooltip } from '../Tooltip/Tooltip';
import { autobind } from './../../utilities/autobind';
import './messageBox.scss';

export class MessageBox extends React.Component<IMessageBoxProps, {}> {
    public static defaultProps: any = {
        level: MessageLevel.Information,
        closeText: 'Close',
        acceptText: 'Save',
        isLoading: false
    };

    public render() {
        const {
            message,
            title,
            buttons,
            onCustomButtonClick,
            onClose,
            onAccept,
            closeText,
            acceptText,
            level,
            onDismiss,
            isLoading,
            hasCloseXButton,
            isOpen,
            errorMessage,
            acceptButtonDisabled,
            bulletedList,
            iconName,
            className
        } = this.props;

        const mappedButtons = buttons && buttons.map((button, index) => {
            let buttonText = '';
            let buttonClassName = 'button-primary';
            if (typeof button === 'string') {
                buttonText = button;
            } else {
                const customButton = button as IMessageBoxButton;
                ({ title: buttonText, className: buttonClassName } = customButton);
            }
            return (
                <Button
                    className={buttonClassName}
                    onClick={() => onCustomButtonClick(index)}
                >
                    {buttonText}
                </Button>
            );
        });

        let iconToBeUsed = iconName;

        if (!iconToBeUsed) {
            switch (level) {
                case MessageLevel.Information:
                    iconToBeUsed = 'icon-details';
                    break;
                case MessageLevel.Warning:
                    iconToBeUsed = 'icon-warning';
                    break;
                case MessageLevel.Error:
                    iconToBeUsed = 'icon-error';
                    break;
            }
        }

        let containerClassName = classNames('message-box-container', className);

        return (
            <Dialog
                title={title}
                isOpen={isOpen}
                onDismiss={onDismiss}
                hasCloseXButton={hasCloseXButton}
                containerClassName="message-box-dialog"
            >
                <div className={containerClassName}>
                    <Icon iconName={iconToBeUsed} />
                    {message}
                </div>
                {this._renderBulletList()}
                {
                    isLoading && <Spinner className="message-box-spinner" />
                }
                {
                    errorMessage !== undefined && errorMessage !== '' &&
                    <Tooltip
                        className="tooltip-error"
                        containerClass="operation-error-tooltip-container"
                        content={errorMessage}
                        directionalHint={DirectionalHint.rightCenter}
                    >
                        <Icon className="operation-error" iconName="icon-warning2" />
                    </Tooltip>
                }
                <DialogFooter>
                    {onClose && <Button className="button-textual" onClick={onClose}>{closeText}</Button>}
                    {buttons && mappedButtons}
                    {onAccept && <Button className="button-primary" disabled={acceptButtonDisabled} onClick={onAccept}>{acceptText}</Button>}
                </DialogFooter>
            </Dialog>
        );
    }

    @autobind
    _renderBulletList() {
        if (!this.props.bulletedList || this.props.bulletedList.length === 0) {
            return null;
        }

        return (
            <ul>
                {this.props.bulletedList.map(data => (
                    <li>{data}</li>
                ))}
            </ul>
        );
    }
}
