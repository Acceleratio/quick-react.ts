export interface IMessageBoxButton {
    title: string;
    className?: string;
}

export enum MessageLevel {
    Information,
    Warning,
    Error
}

export interface IMessageBoxProps {
    isOpen: boolean;
    message: string | JSX.Element;
    title?: string;
    level?: MessageLevel;
    iconName?: string;
    className?: string;
    onDismiss?(): void;
    onClose?(): void;
    onAccept?(): void;
    hasCloseXButton?: boolean;
    closeText?: string;
    acceptText?: string;
    acceptButtonDisabled?: boolean;
    buttons?: Array<string | IMessageBoxButton>;
    onCustomButtonClick?(index: number): void;
    isLoading?: boolean;
    errorMessage?: string;
    bulletedList?: Array<string>;
}
