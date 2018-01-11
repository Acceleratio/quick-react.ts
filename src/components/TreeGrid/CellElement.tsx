import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ICellElementProps, ICellElementState } from './CellElement.Props';
import { autobind } from '../../utilities/autobind';


export class CellElement extends React.PureComponent<ICellElementProps, ICellElementState> {
    constructor(props) {
        super(props);
        this.state = {
            element: props.element
        };
    }

    componentWillReceiveProps(nextProps: ICellElementProps) {
        if (nextProps.element !== this.props.element) {
            this.setState((prevState) => { return { ...prevState, element: nextProps.element }; });
        }
    }

    @autobind
    private _onMouseEnter() { 
        if (this.props.onMouseEnter) {
            this.props.onMouseEnter(this.props.rowClass);
        }
    }
    @autobind
    private _onMouseLeave() { 
        if (this.props.onMouseLeave) {
        this.props.onMouseLeave(this.props.rowClass); 
        }
    }
    @autobind
    private _onClick() { 
        if (this.props.onClick) {
            this.props.onClick(this.props.onClickParameter); 
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
            {this.state.element}
            </div>
        );
    }
}
