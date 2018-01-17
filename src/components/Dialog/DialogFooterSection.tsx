import * as React from 'react';
import * as classNames from 'classnames';

export enum DialogFooterSectionPosition {
    Left = 'left',
    Right = 'right'
}

export interface IDialogFooterSectionProps {
    position?: DialogFooterSectionPosition;
    className?: string;
}

export const DialogFooterSection: React.SFC<IDialogFooterSectionProps> =
    ({ className, position = DialogFooterSectionPosition.Right, children }) => (
        <div className={classNames('dialog-footer-section', className, position)}>
            {children}
        </div>
    );
