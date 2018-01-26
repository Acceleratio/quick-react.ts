/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { autobind } from './../../src/utilities/autobind';
import { CheckboxList } from './../../src/components/CheckboxList/CheckboxList';

export class Index extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            checkboxElements: [
                { id: 'A', text: 'Option A', checked: true, tooltip: {content: 'Option A tooltip'}},
                { id: 'B', text: 'Option B' },
                { id: 'C', text: 'Option C' },
                { id: 'E', text: 'Option E' },
                { id: 'G', text: 'Option G' }
            ]
        };
    }

    public render() {
        return (
            <div>
                <CheckboxList onCheckboxChanged={this._onCheckboxListChange}
                    items={[
                        { id: 'A', text: 'Option A', isOpen: false, children: [{ text: 'Option B', checked: false, id: 'B1' }, { text: 'Option B', id: 'B2' }, { text: 'Option B', id: 'B3' }] },
                        { id: 'C', text: 'Option C', isOpen: false, children: [{ text: 'Option D', id: 'D1' }, { text: 'Option D', id: 'D2' }, { text: 'Option D', id: 'D3' }] },
                        { id: 'E', text: 'Option E', isOpen: false, children: [{ text: 'Option F', id: 'F1' }, { text: 'Option F', id: 'F2' }, { text: 'Option F', id: 'F3' }] },
                        { id: 'G', text: 'Option G', isOpen: false, children: [{ text: 'Option H', id: 'H1' }, { text: 'Option H', id: 'H2' }, { text: 'Option H', id: 'H3' }] }
                    ]}>
                </CheckboxList>
                <br /><br />

                <CheckboxList title={'Checkbox List'} onCheckboxChanged={this._onCheckboxListChange} items={this.state.checkboxElements}></CheckboxList>
            </div>
        );
    }

    @autobind
    private _onCheckboxListChange(ev, itemId, checked) {
        this.setState({
            checkboxElements: this.state.checkboxElements.map((item) => {
                if (itemId.indexOf(item.id) > -1) {
                    return { id: item.id, text: item.text, checked: checked, tooltip: item.tooltip };
                } else {
                    return item;
                }
            })
        });
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
