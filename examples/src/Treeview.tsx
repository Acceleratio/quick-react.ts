/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Treeview } from './../../src/components/Treeview/Treeview';
import { elements } from './../MockData/treeviewElements';
import { ITreeviewItem } from '../../src/components/Treeview/TreeviewItem.Props';
import { autobind } from './../../src/utilities/autobind';

export class Index extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            treeviewElements: elements
        };
    }

    public render() {
        return (
            <div>
                <Treeview
                    onExpand={this._onExpand}
                    onSelect={this._onCheckboxListChange}
                    showCheckbox={true}
                    items={this.state.treeviewElements}
                    recursive={true}
                />
                <br />
                <br />

                <Treeview onSelect={this._onTreeviewItemClick.bind(this)} showCheckbox={false} items={this.state.treeviewElements} recursive={true} />
                <br />
            </div>
        );
    }

    @autobind
    private _onExpand(itemId: string, expanded: boolean) {
        let { treeviewElements } = this.state;

        const changedElements = treeviewElements.map((element: ITreeviewItem, index: number) => {
            if (element.id === itemId) {
                console.log('found changed: ', element);
                let el = { ...element, isOpen: expanded };
                console.log(el === element);
                return el;
            }
            return element;
        });

        this.setState({
            treeviewElements: changedElements
        });
    }

    private _onTreeviewItemClick(ev, itemId, checked) {
        console.log('checking : ', itemId, checked);
        this.setState({
            treeviewElements: this.state.treeviewElements.map((item) => {
                if (itemId.indexOf(item.id) > -1) {
                    return { id: item.id, text: item.text, parentId: item.parentId, checked: checked };
                } else {
                    return item;
                }
            })
        });
    }

    private _onCheckboxListChange(ev, itemId, checked) {
        console.log('checking : ', itemId, checked);
    }

}

ReactDOM.render(<Index />, document.getElementById('root'));
