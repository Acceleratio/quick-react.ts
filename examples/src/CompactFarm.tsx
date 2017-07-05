/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CompactFarm } from './../../src/components/CompactFarm/CompactFarm';
import { ICompactFarmProps } from './../../src/components/CompactFarm/CompactFarm.Props';
import { dummyDashboard, generateMeasures } from './../MockData/DashboardDummy';

export class Index extends React.Component<any, any> {
       public constructor() {
        super();
         this.state = {
            farm: dummyDashboard.farms[0]
        };    
    }

    public render() {
        return (
            <div>
                <CompactFarm farm={this.state.farm} filter={''} />              
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
