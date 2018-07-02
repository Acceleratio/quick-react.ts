import * as React from 'react';

export enum renderModeEnum {
    Text,
    Icon,
    Both
}
export interface IPivotItemProps extends React.HTMLProps<HTMLDivElement> {
    linkText: string;
    linkIcon?: string;
    linkRenderMode?: renderModeEnum;
    itemKey?: string;
    itemCount?: number;
    disabled?: boolean;
}
