import * as React from 'react';
import './Dialog.scss';

export class DialogFooter extends React.Component<any, any> {
    public render() {
        return (
            <div className="dialog-footer">
                {this.props.children}
            </div>
        );
    }
}
