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
    isLoading?: boolean;
    width?: number;
}

export enum ElementType { button, anchor }
