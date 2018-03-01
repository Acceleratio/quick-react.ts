/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Dashboard } from './../../src/components/Dashboard/Dashboard';
import { getDummyDashboard, generateMeasures } from '../MockData/DashboardDummy';
import { IGroup, IServer, ServerStatus } from './../../src/models';

const dummyDashboard = getDummyDashboard(true); // change to true/false to show/hide roles on tiles

export class Index extends React.Component<any, any> {
    public constructor(props) {
        super(props);
        this.state = {
            farms: dummyDashboard.farms
        };
        setInterval(() => {
            let newFarms = this.state.farms.map((farm: IGroup) => {
                let servers = farm.servers.map((server: IServer) => {
                    let measures = generateMeasures();
                    let status = ServerStatus.Offline;
                    if (measures.length > 0) {
                        status = ServerStatus.OK;
                        if (measures.filter(t => { return t.status === ServerStatus.Warning; }).length > 0) {
                            status = ServerStatus.Warning;
                        }
                        if (measures.filter(t => { return t.status === ServerStatus.Critical; }).length > 0) {
                            status = ServerStatus.Critical;
                        }
                    }
                    if (Math.random() < 0.05) { status = ServerStatus.Offline; }
                    if (Math.random() < 0.05) { status = ServerStatus.Disabled; }
                    if (Math.random() < 0.05) { status = ServerStatus.CountersDisabled; }
                    return {
                        id: server.id,
                        status: status,
                        roles: server.roles,
                        onRoleEdit: server.onRoleEdit,
                        onClose: server.onClose,
                        name: server.name,
                        measures: measures,
                        type: server.type
                    };
                });
                return {
                    id: farm.id,
                    type: farm.type,
                    name: farm.name,
                    servers: servers
                };
            });
            this.setState({ farms: newFarms });
        }, 5000);
    }

    public render() {
        return (
            <div style={{ height: '900px' }}>
                <Dashboard
                    differentDashboards={dummyDashboard.differentDashboards}
                    groupOnClick={dummyDashboard.groupOnClick}
                    farms={this.state.farms}
                    filter={''}
                    title={dummyDashboard.title}
                    initialActiveView={0}
                    initialActiveGrouping={0}
                    hasAddButton
                    addFarm={dummyDashboard.addFarm}
                    onAddToGroup={dummyDashboard.onAddToGroup}
                    onGroupDelete={dummyDashboard.onGroupDelete}
                    onGroupEdit={dummyDashboard.onGroupEdit}
                    onServerRoleEdit={dummyDashboard.onServerRoleEdit}
                    serverOnClick={dummyDashboard.serverOnClick}
                    icons={dummyDashboard.icons}
                    onServerClose={dummyDashboard.onServerClose}
                    activeFilters={dummyDashboard.activeFilters}
                />
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
