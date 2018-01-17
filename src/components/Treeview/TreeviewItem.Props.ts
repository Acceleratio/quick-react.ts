import * as React from 'react';
import { ITooltipProps } from '../../index';

export interface ITreeviewItemProps {
    item?: ITreeviewItem;
    onChange?: (ev?: React.FormEvent<HTMLElement>, itemIds?: Array<string>, checked?: boolean) => void;
    showCheckbox?: boolean;
    children?: ITreeviewItem[];
    recursive?: boolean;
    className?: string;
    onExpand?: (itemId: string, expanded: boolean) => void;
}

export interface IHoverOverBtn {
    iconName: string;
    callback: (item: any) => void;
    tooltip?: ITooltipProps;
}

export interface ITreeviewItem {
    text?: string;
    id?: string;
    children?: ITreeviewItem[];
    isOpen?: boolean;
    checked?: boolean;
    parentId?: string;
    hoverOverBtn?: Array<IHoverOverBtn>;
    className?: string;
    title?: string;
    iconClassName?: string;
}
