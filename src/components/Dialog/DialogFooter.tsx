import * as React from 'react';
import './Dialog.scss';

export interface IDialogFooterProps {
    hasFixedWidth?: boolean;
}

export interface IDialogFooterState {
    width: number;
}

export class DialogFooter extends React.Component<IDialogFooterProps, IDialogFooterState> {
    static defaultProps = {
        hasFixedWidth: false
    };

    state = {
        width: null
    };

    private divRef = (ref: HTMLDivElement) => {
        if (ref == null) {
            return;
        }

        if (this.props.hasFixedWidth) {
            this.setState({ width: ref.offsetWidth });
        }
    }

    public render() {
        return (
            <div className="dialog-footer" ref={this.divRef} style={{ maxWidth: this.state.width }}>
                {this.props.children}
            </div>
        );
    }
}
