import * as React from 'react';

import { autobind } from '../../utilities/autobind';
import { Checkbox } from '../Checkbox/Checkbox';
import { ICellElementProps, defaultProps } from './CellElement.Props';

export class CellElement extends React.PureComponent<ICellElementProps, {}> {
    public static defaultProps = defaultProps;

    @autobind
    private _onMouseEnter() {
        this.props.onMouseEnter(this.props.rowIndex);
    }

    @autobind
    private _onMouseLeave() {
        this.props.onMouseLeave(this.props.rowIndex);
    }

    @autobind
    private _onClick(ev) {
        this.props.onClick(ev, this.props.onClickParameter);
    }

    @autobind
    private _onDoubleClick() {
        this.props.onRowDoubleClicked(this.props.rowData);
    }

    public render() {
        return (
            <div
                key={this.props.id}
                style={this.props.style}
                className={this.props.className}
                title={this.props.title}
                onMouseEnter={this._onMouseEnter}
                onMouseLeave={this._onMouseLeave}
                onClick={this._onClick}
                onDoubleClick={this._onDoubleClick}
            >
                {this.props.element}
            </div>
        );
    }
}
