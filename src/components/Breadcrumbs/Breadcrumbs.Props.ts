import * as React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { IBreadcrumbChild } from './BreadcrumbItem.Props';

export interface IBreadcrumbsProps extends React.Props<any> {
    items: IBreadcrumbItem[];
    className?: string;
    url: string;
    homeDisplayName?: string;
    homeUrl?: string;
    homeIconName?: string;
    onPathClick: (path: string) => void;
    iconNameCollapsed?: string;
    iconNameExpanded?: string;
}

export interface IBreadcrumbItem extends React.Props<any> {
    key: string;
    displayName: string;
    href?: string;
    iconName?: string;
    text?: string;
    onClick?: (ev?: React.MouseEvent<any>, item?: IBreadcrumbItem) => void;
    children?: IBreadcrumbItem[];
}

export interface ICurrentPathItem {
    name: string;
    url: string;
    iconName?: string;
    text?: string;
    children: Array<IBreadcrumbChild>;
}
