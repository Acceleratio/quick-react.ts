import * as React from 'react';

export interface IMessageBarProps extends React.HTMLProps<HTMLElement> {
    messageBarType?: MessageBarType;
    expandOnHover?: boolean;
    hoverDelayInSeconds?: number;
    hoverAnimationDurationInSeconds?: number;
    actions?: JSX.Element;
    onDismiss?: (ev?: React.MouseEvent<HTMLElement>) => any;
    hasDontShowAgain?: boolean;
    dontShowAgainChecked?: boolean;
    dontShowAgainClicked?: (ev?: React.FormEvent<HTMLElement>, itemId?: string, checked?: boolean) => void;
}

export enum MessageBarType {
    info,
    error,
    warning,
    success
}
