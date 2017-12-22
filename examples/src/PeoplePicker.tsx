/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PeoplePicker } from '../../src/components/PeoplePicker/PeoplePicker';
import { peoplePickerData } from '../MockData/peoplePickerData';
import { autobind } from '../../src/utilities/autobind';
import { IPrincipal } from '../../src/components/PeoplePicker/Principal.Props';


export class Index extends React.Component<any, any> {
    private _handleSelect(selectedPersonList: IPrincipal[]) {
        // console.log(selectedPersonList);
    }

    private _handleSearch(searchedValue: string) {
       // console.log(searchedValue);
    }

    public render() {
        return (
            <div style={{ width: '900px' }}>
                <PeoplePicker 
                    labelText="PeoplePicker"
                    onSearch={this._handleSearch}
                    onSelect={this._handleSelect}
                    placeholder="Search for people"
                    suggestionList={peoplePickerData}
                />
                <br/>
                <PeoplePicker 
                    labelText="Disabled PeoplePicker "
                    disabled={true}
                    onSearch={this._handleSearch}
                    onSelect={this._handleSelect}
                    suggestionList={peoplePickerData}
                />
                <br/>
                <PeoplePicker 
                    errorMessage="This is error message! This is error message!"
                    labelText="Error PeoplePicker"
                    onSearch={this._handleSearch}
                    onSelect={this._handleSelect}
                    placeholder="Search for people"
                    suggestionList={peoplePickerData}
                />
                <br/>
                <PeoplePicker 
                    labelText="Single Select PeoplePicker"
                    onSearch={this._handleSearch}
                    onSelect={this._handleSelect}
                    placeholder="Search for people"
                    singleSelect={true}
                    suggestionList={peoplePickerData}
                />
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
