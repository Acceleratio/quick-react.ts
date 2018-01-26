import * as React from 'react';
import { ITooltipProps } from '../Tooltip';

export interface ICheckboxProps extends React.HTMLProps<HTMLElement> {
    className?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    label?: string;
    disabled?: boolean;
    onChange?: (ev?: React.FormEvent<HTMLElement>, itemId?: string, checked?: boolean) => void;
    inputProps?: React.HTMLProps<HTMLInputElement>;
    itemId?: string;
    iconClassName?: string;
    tooltip?: ITooltipProps;
}

export interface ICheckbox {
    checked: boolean;
    focus(): void;
}
