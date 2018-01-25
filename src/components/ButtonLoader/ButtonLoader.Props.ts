import * as React from 'react';
import { ButtonLoader } from './index';
import { Button } from '../Button/Button';


export interface IButtonLoaderProps extends React.Props<ButtonLoader> {
    isVisible?: boolean;
    icon?: string;
    disabled?: boolean;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement | Button>;
    isLoading?: boolean;
    isSucces?: boolean;
    isError?: boolean;
    buttonText?: string;
}

export interface IButtonLoaderState {
    width?: number;
}
