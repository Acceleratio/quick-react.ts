/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ServerGridDashboard } from '../../src/components/ServerGridDashboard/ServerGridDashboard';
import { IServerGridDashboardProps } from '../../src/components/ServerGridDashboard/ServerGridDashboard.Props';
import { createFarms } from '../MockData/farms';
import { convertFarm } from '../MockData/DashboardDummy';

import '../../src/components/Dashboard/Dashboard.scss';

export class Index extends React.Component<any, any> {
    public constructor() {
        super();
        this.state = {
            farms: createFarms(10, 20, 50).map(convertFarm)
        };
        setTimeout(this.refreshFarms.bind(this), 3000);
    }

    refreshFarms() {
        this.setState({ farms: createFarms(10, 20, 50).map(convertFarm) });
        setTimeout(this.refreshFarms.bind(this), 3000);
    }

    public render() {
        return (
            <div>
                <ServerGridDashboard
                    className={'viewport-height'}
                    farms={this.state.farms}
                    filter={''} />
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
