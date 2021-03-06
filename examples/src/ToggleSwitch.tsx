/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from './../../src/components/Button/Button';
import { ToggleSwitch } from './../../src/components/ToggleSwitch/ToggleSwitch';

export class Index extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <ToggleSwitch onChange={this._onToggle} label={'Toggle'}/> <br/>
                <ToggleSwitch checked={false} disabled={true}/> <br/>
                <ToggleSwitch checked={true} disabled={true} label={'Disabled Toggle'}/> <br/>
            </div>
        );
    }
     private _onToggle(checked) {
        console.log(checked);
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
