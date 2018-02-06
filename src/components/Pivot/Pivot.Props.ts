import * as React from 'react';
import { Pivot } from './Pivot';
import { PivotItem } from './PivotItem';

export interface IPivotProps extends React.Props<Pivot> {
    selectedIndex?: number;
    selectedKey?: string;
    onLinkClick?: (item?: PivotItem, ev?: React.MouseEvent<any>) => void;
    linkFormat?: PivotLinkFormat;
    className?: string;
    textSize?: number;
}

export enum PivotLinkFormat {
    links,
    tabs
}
