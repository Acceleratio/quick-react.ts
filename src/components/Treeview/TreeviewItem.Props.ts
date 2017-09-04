import * as React from 'react';

export interface ITreeviewItemProps {
    item?: ITreeviewItem;
    onChange?: (ev?: React.FormEvent<HTMLElement>, itemIds?: Array<string>, checked?: boolean) => void;
    showCheckbox?: boolean;
    children?: ITreeviewItem[];
    recursive?: boolean;

}

export interface IHoverOverBtn {
    iconName: string;
    callback: (id: string) => void;
}

export interface ITreeviewItem {
    text?: string;
    id?: string;
    children?: ITreeviewItem[];
    isOpen?: boolean;
    checked?: boolean;
    parentId?: string;
    hoverOverBtn?: Array<IHoverOverBtn>;
}
export function MapChildren(item: ITreeviewItem, items: ITreeviewItem[]): ITreeviewItem[] {

    let children = items.filter((element) => {
        return (element.parentId === item.id);
    });

    children.forEach((element) => {
        let grandChildren = MapChildren(element, items);
        element.children = grandChildren;
    });
    return children;
}

