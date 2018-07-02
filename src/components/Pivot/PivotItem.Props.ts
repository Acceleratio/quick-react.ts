import * as React from 'react';

export enum RenderModeEnum {
    Text,
    Icon,
    Both
}
export interface IPivotItemProps extends React.HTMLProps<HTMLDivElement> {
    linkText: string;
    linkIcon?: string;
    linkRenderMode?: RenderModeEnum;
    itemKey?: string;
    itemCount?: number;
    disabled?: boolean;
}
