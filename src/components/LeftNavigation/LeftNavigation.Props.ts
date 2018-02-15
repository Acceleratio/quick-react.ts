import * as React from 'react';
import { LeftNavigation } from './LeftNavigation';


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
    otherOptions?: ILeftNavigationOption[];
    expandCaptionsBehavior?: ExpandCaptionsBehaviorEnum;
}

export interface ILeftNavigationOption {
    id: string;
    text: string;
    href?: string;
    icon?: string;
    selected?: boolean;
    disabled?: boolean;
}
