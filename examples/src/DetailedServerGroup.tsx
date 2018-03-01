/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { DetailedServerGroup } from './../../src/components/DetailedServerGroup/DetailedServerGroup';
import { DemoServerGroup } from './../MockData/farms';

export class Index extends React.Component<any, any> {
    public constructor(props) {
        super(props);
        this.state = {
            farm: DemoServerGroup
        };
    }

    public render() {
        return (
            <div style={{ height: '900px' }}>
                <DetailedServerGroup id={''} filter={''} name={this.state.farm.name} servers={this.state.farm.servers} iconName={'icon-group'} iconTitle={'Group'} />
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
