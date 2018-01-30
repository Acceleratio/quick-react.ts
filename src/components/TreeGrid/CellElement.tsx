import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ICellElementProps } from './CellElement.Props';
import { autobind } from '../../utilities/autobind';


export class CellElement extends React.PureComponent<ICellElementProps, {}> {

    @autobind
    private _onMouseEnter() { 
        if (this.props.onMouseEnter) {
            this.props.onMouseEnter(this.props.rowIndex);
        }
    }
    @autobind
    private _onMouseLeave() { 
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave(this.props.rowIndex); 
        }
    }
    @autobind
    private _onClick(ev) { 
        if (this.props.onClick) {
            this.props.onClick(ev, this.props.onClickParameter); 
        }
    }
    @autobind
    private _onDoubleClick() {
        if (this.props.onRowDoubleClicked) {
            this.props.onRowDoubleClicked(this.props.rowData);
        }
    }

    render() {
        return(
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
