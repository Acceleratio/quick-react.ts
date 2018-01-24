import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Icon } from '../Icon/Icon';
import { ActionItem } from './QuickGrid.Props';
import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownType } from '../Dropdown/Dropdown.Props';


export interface IQuickGridRowActionsHandler {
    onGetRowActions?: (rowIndex: number) => Array<ActionItem>;
    onActionClicked?: (rowIndex: number, action: ActionItem) => void;
}


export class QuickGridRowActionsHandler extends React.PureComponent<IQuickGridRowActionsHandler, {}> {

    private _gridElement: Element;
    private _hoveredRowIndex: number;
    private _hoveredHTMLRowElement: Element;
    private _dropdownOpened: boolean;
    setGridRootElement(gridElement: Element) {
        this._gridElement = gridElement;
    }

    clearHoveredElement(force: boolean = true) {
        if (this._dropdownOpened) {
            return;
        }
        if (this._hoveredHTMLRowElement) {
            ReactDOM.unmountComponentAtNode(this._hoveredHTMLRowElement);
            this._hoveredHTMLRowElement = null;
        }
        this.removeHoveredStyle(this._hoveredRowIndex);
        this._hoveredRowIndex = -1;
    }

    markRowAsHovered(rowIndex: number) {
        if (this._dropdownOpened) {
            return;
        }
        if (rowIndex === this._hoveredRowIndex) {
            return;
        }

        if (this._hoveredRowIndex && this._hoveredRowIndex !== -1) {
            this.removeHoveredStyle(this._hoveredRowIndex);
            this.clearHoveredElement(false);
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
            if (rowElements.length > 0) {
                let hoverContainer = rowElements[rowElements.length - 1].getElementsByClassName('hover-allowed');

                if (hoverContainer.length > 0 && hoverContainer[0].children.length === 0) {
                    this._hoveredHTMLRowElement = hoverContainer[0];
                }
            }
        }

        this._hoveredRowIndex = rowIndex;
        this.forceUpdate();
    }

    private removeHoveredStyle(rowIndex: number) {
        if (this._dropdownOpened) {
            return;
        }
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
            let renderedActions = this.getRenderedActions(this._hoveredRowIndex);
            if (renderedActions) {
                ReactDOM.render(renderedActions, this._hoveredHTMLRowElement);
            }
        }
    }

    getRenderedActions(rowIndex: number) {
        let actions = this.props.onGetRowActions(rowIndex);
        let renderedActions = renderActions(rowIndex,
            actions,
            this.props.onActionClicked,
            (opened) => {
                this._dropdownOpened = opened;
            }
        );

        return renderedActions;
    }

    componentWillUnmount() {
        this.clearHoveredElement();
    }

    onActionItemClicked = () => {
        if (this.props.onActionClicked) {

        }
    }
}

export function renderActions(rowIndex: number, actions: Array<ActionItem>, onActionClicked: (rowIndex: number, action: ActionItem) => void, onMenuToggle: (opened: boolean) => void) {
    if (!actions || actions.length === 0) {
        return null;
    }

    const mapAction = (x: ActionItem) => <Icon key={x.commandName} iconName={x.iconName} title={x.name} className="hoverable-items__btn" onClick={() => onActionClicked(rowIndex, x)} />;
    let renderDropDown = actions.length >= 4;
    let elements = [];
    if (renderDropDown) {
        elements.push(mapAction(actions[0]));
        elements.push(mapAction(actions[1]));
        let actionOptions = [];
        for (let i = 2; i < actions.length; i++) {
            actionOptions.push({ key: actions[i].commandName, icon: actions[i].iconName, text: actions[i].name });
        }
        elements.push(
            <Dropdown
                key="hoverDropDown"
                className="hoverable_items__btn-dropdown"
                dropdownKey={rowIndex}
                icon="svg-icon-in_progress"

                dropdownType={DropdownType.actionDropdown}
                displaySelection={false}
                onClick={(item) => onActionClicked(rowIndex, actions.find(x => x.commandName === item.key))}
                options={actionOptions}
                onMenuToggle={onMenuToggle}
                onClosed={() => onMenuToggle(false)}
            />);
    } else {
        elements = actions.map(mapAction);
    }

    return <span key="hoverActionsSpan" className="hoverable-items-inner-container">
        {
            elements
        }
    </span>;
}
