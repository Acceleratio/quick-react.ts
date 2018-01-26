import * as React from 'react';
import { ITooltipProps } from '../Tooltip';

export interface ICheckboxListItemProps {
    item?: ICheckboxListItem;
    onChange?: (ev?: React.FormEvent<HTMLElement>, itemId?: string, checked?: boolean) => void;
}

export interface ICheckboxListItem {
    text?: string;
    id?: string;
    children?: ICheckboxListItem[];
    isOpen?: boolean;
    checked?: boolean;
    tooltip?: ITooltipProps;
}
