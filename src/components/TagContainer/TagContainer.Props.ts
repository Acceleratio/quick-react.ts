import * as React from 'react';

export interface ITag {
    display: string;
    iconName: string;
    className?: string;
    tooltip?: string;
}

export interface ITagContainerProps {
    tags: Array<ITag>;
    title?: string;
}
