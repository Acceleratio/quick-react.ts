import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Icon } from '../Icon/Icon';


export interface IQuickGridRowActionsHandler {

}


export class QuickGridRowActionsHandler extends React.PureComponent<IQuickGridRowActionsHandler, {}> {

    private _gridElement: Element;
    private _hoveredRowIndex: number;
    private _hoveredHTMLRowElement: Element;

    setGridRootElement(gridElement: Element) {
        this._gridElement = gridElement;
    }

    clearHoveredElement() {
        if (this._hoveredHTMLRowElement) {
            ReactDOM.unmountComponentAtNode(this._hoveredHTMLRowElement);
            this._hoveredHTMLRowElement = null;
        }
        this.removeHoveredStyle(this._hoveredRowIndex);
        this._hoveredRowIndex = -1;
    }

    markRowAsHovered(rowIndex: number) {
        if (rowIndex === this._hoveredRowIndex) {
            return;
        }

        if (this._hoveredRowIndex && this._hoveredRowIndex !== -1) {
            this.removeHoveredStyle(this._hoveredRowIndex);
            this.clearHoveredElement();
        }

        if (rowIndex && rowIndex !== -1) {

            let rowClass = 'grid-row-' + rowIndex;
            let rowElements = this._gridElement.getElementsByClassName(rowClass);
            for (let i = 0; i < rowElements.length; i++) {
                const classList = rowElements[i].classList;
                if (!classList.contains('is-hover')) {
                    classList.add('is-hover');
                }
            }
            let hoverContainer = rowElements[rowElements.length - 1].getElementsByClassName('hover-allowed');

            if (hoverContainer.length > 0 && hoverContainer[0].children.length === 0) {
                this._hoveredHTMLRowElement = hoverContainer[0];
            }
        }

        this._hoveredRowIndex = rowIndex;
        this.forceUpdate();
    }

    private removeHoveredStyle(rowIndex: number) {
        if (rowIndex === -1) {
            return;
        }        

        let prevHoveredRowClass = 'grid-row-' + rowIndex;
        let prevHoveredRowElements = this._gridElement.getElementsByClassName(prevHoveredRowClass);
        for (let i = 0; i < prevHoveredRowElements.length; i++) {
            const classList = prevHoveredRowElements[i].classList;
            if (classList.contains('is-hover')) {
                classList.remove('is-hover');
            }
        }    
    }

    render() {
        return null;
    }

    componentDidUpdate() {
        if (this._hoveredHTMLRowElement) {
            ReactDOM.render(<Icon iconName="svg-icon-add" className="hoverable-items__btn" onClick={this.onActionItemClicked} />, this._hoveredHTMLRowElement);
        }
    }

    componentWillUnmount() {
        this.clearHoveredElement();
    }

    onActionItemClicked = () => {
        console.log("ovo je klik");
    }
}
