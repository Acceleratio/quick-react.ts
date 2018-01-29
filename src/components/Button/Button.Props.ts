import * as React from 'react';
import { Button } from './Button';

export interface IButton { focus(); }

export interface IButtonProps extends React.HTMLProps<HTMLButtonElement | HTMLAnchorElement | Button> {
    isVisible?: boolean;
    href?: string;
    icon?: string;
    description?: string;
    disabled?: boolean;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement | Button>;
    ariaLabel?: string;
    ariaDescription?: string;
    /**
     * used to indicate an async operation in progress
     */
    isLoading?: boolean;
    /**
     * used to show a checkmark or a error icon after an async action
     * to hide the status, set to undefined
     */
    isSuccess?: boolean;
    width?: number;
}

export enum ElementType { button, anchor }
