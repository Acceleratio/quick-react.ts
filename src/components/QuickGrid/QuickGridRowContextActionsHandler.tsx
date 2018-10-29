import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Icon } from '../Icon/Icon';
import { ActionItem, isContextActionsObject, ContextActionsObject } from './QuickGrid.Props';
import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownType } from '../Dropdown/Dropdown.Props';
import { Tooltip } from '../Tooltip/Tooltip';
import { DirectionalHint } from '../../index';


export interface IQuickGridRowAContextActionsHandlerProps {
    hideDropdownActionIcons?: boolean;
    delayMs?: number;
    onGetRowActions?: (rowIndex: number) => Array<ActionItem> | ContextActionsObject;
    onActionClicked?: (rowIndex: number, action: ActionItem) => void;
}

export class QuickGridRowContextActionsHandler extends React.PureComponent<IQuickGridRowAContextActionsHandlerProps, {}> {

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
        this._removeHoveredStyle(this._hoveredRowIndex);
        this._hoveredRowIndex = -1;
    }

    markRowAsHovered(rowIndex: number) {
        if (this._dropdownOpened) {
            return;
        }
        if (rowIndex === this._hoveredRowIndex) {
            return;
        }

        if (this._hoveredRowIndex !== undefined && this._hoveredRowIndex !== -1) {
            this._removeHoveredStyle(this._hoveredRowIndex);
            this.clearHoveredElement(false);
        }

        if (rowIndex !== undefined && rowIndex !== -1) {

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

    private _removeHoveredStyle(rowIndex: number) {
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
        let renderedActions = this.renderActions(rowIndex,
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

    renderActions(rowIndex: number, actions: Array<ActionItem> | ContextActionsObject, onActionClicked: (rowIndex: number, action: ActionItem) => void, onMenuToggle: (opened: boolean) => void) {
        const actionItems: Array<ActionItem> = isContextActionsObject(actions) ? actions.actions : actions;
        if (!actionItems || actionItems.length === 0) {
            return null;
        }
    
        const mapAction = (x: ActionItem) => {
            const mappedAction = <Icon key={x.commandName} iconName={x.iconName} title={x.tooltip ? undefined : x.name} className="hoverable-items__btn" onClick={() => onActionClicked(rowIndex, x)} />;
            return x.tooltip !== undefined ? <Tooltip key={x.commandName} {...x.tooltip} delayMs={this.props.delayMs} >  {mappedAction} </Tooltip> : mappedAction;
        };
    
        let elements = [];
        const dropdownIcon = isContextActionsObject(actions) && actions.dropdownIconName ? actions.dropdownIconName : 'svg-icon-more';
        const dropdownActions = actionItems.filter((action, index) => action.showInDropdown || (actionItems.length >= 4 ? index > 1 : null));

        if (isContextActionsObject(actions) && actions.dropdownCustomRenderer) {
            elements = actionItems.filter(x => !x.showInDropdown).map(mapAction);
            elements.push(
                <Dropdown
                    key="hoverDropDown"
                    className="hoverable_items__btn-dropdown"
                    dropdownKey={rowIndex}
                    icon={dropdownIcon}
                    dropdownType={DropdownType.customDropdown}
                    showArrowIcon={false}
                    onMenuToggle={onMenuToggle}
                    onClosed={() => onMenuToggle(false)}
                    delayMs={this.props.delayMs}
                >
                    {actions.dropdownCustomRenderer(rowIndex, dropdownActions, onActionClicked)}
                </Dropdown>
            );
        } else if (dropdownActions && dropdownActions.length > 0) {
            let actionOptions = [];
            for (let i = 0; i < actionItems.length; i++) {
                if (dropdownActions.find(x => x === actionItems[i])) {
                    let tooltipInfo = actionItems[i].tooltip;
                    if (tooltipInfo && !tooltipInfo.directionalHint) {
                        tooltipInfo = { ...tooltipInfo, directionalHint: DirectionalHint.leftCenter };
                    }
                    actionOptions.push({ key: actionItems[i].commandName, icon: this.props.hideDropdownActionIcons === true ? undefined : actionItems[i].iconName, text: actionItems[i].name, tooltipInfo });
                } else {
                    elements.push(mapAction(actionItems[i]));
                }
            }

            elements.push(
                <Dropdown
                    key="hoverDropDown"
                    className="hoverable_items__btn-dropdown"
                    dropdownKey={rowIndex}
                    icon={dropdownIcon}
                    dropdownType={DropdownType.actionDropdown}
                    displaySelection={false}
                    onClick={(item) => onActionClicked(rowIndex, actionItems.find(x => x.commandName === item.key))}
                    options={actionOptions}
                    onMenuToggle={onMenuToggle}
                    onClosed={() => onMenuToggle(false)}
                    delayMs={this.props.delayMs}
                />);
        } else {
            elements = actionItems.map(mapAction);
        }
    
        return <span key="hoverActionsSpan" className="hoverable-items-inner-container" title="">
            {
                elements
            }
        </span>;
    }
}
