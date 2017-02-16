import * as React from 'react';
import { Dialog } from './Dialog';

export interface IDialogProps extends React.Props<Dialog> {
    isOpen ?: boolean;
    isDarkOverlay?: boolean;
    onDismiss ?: (ev?: React.MouseEvent<HTMLElement>) => any;
    title ?: string;
    subText ?: string;
    isBlocking ?: boolean;
    className ?: string;
    containerClassName ?: string;
    contentClassName ?: string;
    onLayerDidMount ?: () => void;
    onLayerMounted ?: () => void;
    hasCloseXButton ?: boolean;
    layerClassName ?: string;
}