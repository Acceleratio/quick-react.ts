import * as React from 'react';
import { LeftNavigation } from './LeftNavigation';
import { NotificationBubbleStyleObject } from '../NotificationIcon';


export enum ExpandCaptionsBehaviorEnum {
    ShowCaptionsOnHover,
    ShowCaptionsOnToggleButton,
    AlwaysHideCaptions
}

export interface ILeftNavigationProps {
    id?: string;
    options: ILeftNavigationOption[];
    className?: string;
    onClick?: (ev?: React.MouseEvent<HTMLElement>, item?: ILeftNavigationOption) => void;
    expandCaptionsBehavior?: ExpandCaptionsBehaviorEnum;
    notificationBubbleStyleObject?: NotificationBubbleStyleObject;
    expandMargin?: boolean;
    expandDelayMs?: number;
}

export interface ILeftNavigationOption {
    id: string;
    text: string;
    href?: string;
    icon?: string;
    selected?: boolean;
    disabled?: boolean;
    position?: LeftNavigationOptionPositionEnum;
    notificationNumber?: number;
}

export enum LeftNavigationOptionPositionEnum {
    Up = 0,
    Down = 1
}
