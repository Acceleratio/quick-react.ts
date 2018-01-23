import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Icon } from '../Icon/Icon';
import { ActionItem } from './QuickGrid.Props';
import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownType } from '../Dropdown/Dropdown.Props';


export interface IQuickGridRowActionsHandler {
    onGetActionsElement?: (rowIndex: number) => JSX.Element;
    onActionClicked?: (rowIndex: number, action: ActionItem) => void;
}


export class QuickGridRowActionsHandler extends React.PureComponent<IQuickGridRowActionsHandler, {}> {

    private _gridElement: Element;
    private _hoveredRowIndex: number;
    private _hoveredHTMLRowElement: Element;
    private _hoveredReactComponent: any ;
    private _dropdownOpened: boolean;
    setGridRootElement(gridElement: Element) {
        this._gridElement = gridElement;
    }

    clearHoveredElement(force: boolean = true) {       
        // if (this._dropdownOpened) {
        //     return;
        // }
        // // if (this._hoveredHTMLRowElement) {
        // //     ReactDOM.unmountComponentAtNode(this._hoveredHTMLRowElement);
        // //     this._hoveredHTMLRowElement = null;
        // // }
        // this.removeHoveredStyle(this._hoveredRowIndex);
        // this._hoveredRowIndex = -1;
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
            let hoverContainer = rowElements[rowElements.length - 1].getElementsByClassName('hover-allowed');

            if (hoverContainer.length > 0 && hoverContainer[0].children.length === 0) {
                this._hoveredHTMLRowElement = hoverContainer[0];
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
                ReactDOM.render(renderedActions, this._hoveredHTMLRowElement, (component) => {
                    console.log("test")
                    console.log(component)
                    this._hoveredReactComponent = component
                 } );
            }
        }
    }

    getRenderedActions(rowIndex: number) {
        console.log(this._hoveredRowIndex);
        console.log(this._hoveredReactComponent);
        if (rowIndex === this._hoveredRowIndex && this._hoveredReactComponent) {
            console.log("returning cached");
            return this._hoveredReactComponent;
        }
        let renderedActions = renderActions(rowIndex,
            [
                {
                    iconName: 'icon-add',
                    commandName: 'Test action',
                    name: 'TestAction',
                    parameters: null
                },
                {
                    iconName: 'svg-icon-checkmark',
                    commandName: 'Test action2',
                    name: 'TestAction2',
                    parameters: null
                },
                {
                    iconName: 'svg-icon-checkmark',
                    commandName: 'Test action3',
                    name: 'TestAction3',
                    parameters: null
                },
                {
                    iconName: 'svg-icon-checkmark',
                    commandName: 'Test action4',
                    name: 'TestAction4',
                    parameters: null
                },
                {
                    iconName: 'svg-icon-checkmark',
                    commandName: 'Test action5',
                    name: 'TestAction5',
                    parameters: null
                }
            ],
            () => alert('hi'), (opened) => {
                this._dropdownOpened = opened;
                console.log(opened);
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

export function renderActions(rowIndex: number, actions: Array<ActionItem>, onActionClicked: (action: ActionItem) => void, onMenuToggle: (opened: boolean) => void) {
    if (!actions || actions.length === 0) { 
        return null;
    }

//     <div
//     key={key}
//     style={style}
//     className={className}
//     onMouseEnter={onMouseEnter}
//     title={title}
// >
//     <Dropdown
//         dropdownKey={rowIndex}
//         icon={actionIconName}
//         dropdownType={DropdownType.actionDropdown}
//         displaySelection={false}
//         onClick={this.onActionItemClick}
//         options={actionOptions}
//     />
// </div>
    const mapAction = (x: ActionItem) => <Icon key={x.commandName} iconName={x.iconName} className="hoverable-items__btn" onClick={(e) => {e.nativeEvent.preventDefault(); e.nativeEvent.stopPropagation(); }}/>;
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
                dropdownKey={rowIndex}
                icon="svg-icon-in_progress"
                dropdownType={DropdownType.actionDropdown}
                displaySelection={false}
                onClick={() => onActionClicked}
                options={actionOptions}
                onMenuToggle={onMenuToggle}
                onClosed = {() => onMenuToggle(false)}
            />);
    } else {
        elements = actions.map(mapAction);
    }

    return <span style={{display: 'flex'}} onClick={e => e.stopPropagation()}>
        {
           elements
        }
    </span>;
}
