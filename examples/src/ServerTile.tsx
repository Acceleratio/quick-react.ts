/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ServerTile } from './../../src/components/ServerTile/ServerTile';
import { ServerStatus } from './../../src/models';
import { dummyDashboard } from '../MockData/DashboardDummy';

export class Index extends React.Component<any, any> {

    public render() {
        return (
            <div>
                <ServerTile
                    id={'server-123'}
                    status={0}
                    name={'SP2016-Martin'}
                    onClose={(id: string) => console.log('Go away!', id)}
                    diskInformation={[
                        {
                            name: 'Local Disk (C:)',
                            used: 800,
                            capacity: 1000,
                            usageUnit: 'GB',
                            id: 1
                        },
                        {
                            name: 'Data (E:)',
                            used: 560,
                            capacity: 789,
                            usageUnit: 'GB',
                            id: 2
                        }
                    ]}
                    roles={[]}
                    countersData={[
                        { title: 'CPU', currentUsage: '43', usageUnit: '%', hoverText: [''], status: ServerStatus.OK },
                        { title: 'Memory', currentUsage: '7', usageUnit: 'GB', hoverText: ['7GB/10GB (70%)'], status: ServerStatus.Warning },
                        { title: 'Disk', currentUsage: '0,1', usageUnit: 'Mbps', hoverText: ['4.49 Mbps', '2.63 Mbps', '0.3 Mbps'], status: ServerStatus.OK },
                        { title: 'Network', currentUsage: '0,1', usageUnit: 'MB/s', hoverText: ['50.10 kB/s', '23.47 kB/s'], status: ServerStatus.Critical }
                    ]}>
                </ServerTile>

                <ServerTile
                    id={'server-123'}
                    status={0}
                    name={'SP2016-Martin'}
                    numberOfUsers={'10'}
                    onClose={(id: string) => console.log('Go away!', id)}
                    diskInformation={[
                        {
                            name: 'Local Disk (C:)',
                            used: 800,
                            capacity: 1000,
                            usageUnit: 'GB',
                            id: 1
                        },
                        {
                            name: 'Data (E:)',
                            used: 560,
                            capacity: 789,
                            usageUnit: 'GB',
                            id: 2
                        }
                    ]}
                    roles={[{ display: 'WPF', iconName: 'icon-add', tooltip: 'WPF Role' }, { display: 'Search', iconName: 'icon-alert' }]}
                    countersData={[
                        { title: 'CPU', currentUsage: '43', usageUnit: '%', hoverText: [''], status: ServerStatus.OK },
                        { title: 'Memory', currentUsage: '7', usageUnit: 'GB', hoverText: ['7GB/10GB (70%)'], status: ServerStatus.Warning },
                        { title: 'Disk', currentUsage: '0,1', usageUnit: 'Mbps', hoverText: ['4.49 Mbps', '2.63 Mbps', '0.3 Mbps'], status: ServerStatus.OK },
                        { title: 'Network', currentUsage: '0,1', usageUnit: 'MB/s', hoverText: ['50.10 kB/s', '23.47 kB/s'], status: ServerStatus.Critical }
                    ]}>
                </ServerTile>
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
