import { IGroup, IServer, GroupTypeEnum, ServerStatus } from '../models';
import { DashboardGroupingEnum } from '../components/Dashboard/Dashboard.Props';
import { sortServersByStatusAndName } from './server';

export function getGrouped(groups: Array<IGroup>, grouping: DashboardGroupingEnum): Array<IGroup> {
    if (grouping === DashboardGroupingEnum.Smart) {
        return groups;
    } else if (grouping === DashboardGroupingEnum.Status) {
        return groupStatus(groups);
    } else if (grouping === DashboardGroupingEnum.Type) {
        return groupType(groups);
    } else if (grouping === DashboardGroupingEnum.Disabled) {
        return groupNone(groups);
    }
}

function groupNone(groups: Array<IGroup>): Array<IGroup> {
    let allServers: IGroup = {
        id: 'all-servers-group',
        name: 'All Servers',
        type: GroupTypeEnum.Custom,
        servers: new Array<IServer>()
    };
    let serverCheck: { [id: string]: IServer; } = {};
    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        for (let j = 0; j < group.servers.length; j++) {
            let server = group.servers[j];
            doGroupCheck(allServers, server, serverCheck);
        }
    }
    allServers.servers = allServers.servers.sort(sortServersByStatusAndName);
    return [allServers];
}

function doGroupCheck(group: IGroup, server: IServer, checkDictionary: { [id: string]: IServer }) {
    if (!checkDictionary[server.id]) {
        group.servers.push(server);
        checkDictionary[server.id] = server;
    }
}

function groupType(groups: Array<IGroup>): Array<IGroup> {
    let spGroupCheck: { [id: string]: IServer; } = {};
    let spGroup: IGroup = {
        id: 'sharepoint-group',
        name: 'SharePoint Servers',
        type: GroupTypeEnum.SharePoint,
        servers: new Array<IServer>()
    };
    let sqlGroupCheck: { [id: string]: IServer; } = {};
    let sqlGroup: IGroup = {
        id: 'sql-group',
        name: 'SQL Servers',
        type: GroupTypeEnum.Sql,
        servers: new Array<IServer>()
    };
    let sqlAoCheck: { [id: string]: IServer; } = {};
    let sqlAoGroup: IGroup = {
        id: 'sql-ao-group',
        name: 'SQL AlwaysOn Servers',
        type: GroupTypeEnum.SqlAlwaysOn,
        servers: new Array<IServer>()
    };

    let customGroupCheck: { [id: string]: IServer; } = {};
    let customGroup: IGroup = {
        id: 'custom-group',
        name: 'Other',
        type: GroupTypeEnum.Custom,
        servers: new Array<IServer>()
    };

    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        for (let j = 0; j < group.servers.length; j++) {
            let server = group.servers[j];
            switch (server.type) {
                case GroupTypeEnum.SharePoint:
                    doGroupCheck(spGroup, server, spGroupCheck);
                    break;
                case GroupTypeEnum.Sql:
                    doGroupCheck(sqlGroup, server, sqlGroupCheck);
                    break;
                case GroupTypeEnum.SqlAlwaysOn:
                    doGroupCheck(sqlAoGroup, server, sqlAoCheck);
                    break;
                default:
                    doGroupCheck(customGroup, server, customGroupCheck);
                    break;
            }
        }
    }

    return [spGroup, sqlGroup, sqlAoGroup, customGroup];
}

function groupStatus(groups: Array<IGroup>): Array<IGroup> {
    let criticalGroupCheck: { [id: string]: IServer; } = {};
    let criticalGroup: IGroup = {
        id: 'critical-group',
        name: 'Critical',
        type: GroupTypeEnum.Critical,
        servers: new Array<IServer>()
    };
    let warningGroupCheck: { [id: string]: IServer; } = {};
    let warningGroup: IGroup = {
        id: 'warning-group',
        name: 'Warning',
        type: GroupTypeEnum.Warning,
        servers: new Array<IServer>()
    };
    let healthyGroupCheck: { [id: string]: IServer; } = {};
    let healthyGroup: IGroup = {
        id: 'healthy-group',
        name: 'Healthy',
        type: GroupTypeEnum.Healthy,
        servers: new Array<IServer>()
    };
    let offlineGroupCheck: { [id: string]: IServer; } = {};
    let offlineGroup: IGroup = {
        id: 'offline-group',
        name: 'Offline',
        type: GroupTypeEnum.Offline,
        servers: new Array<IServer>()
    };
    let disabledGroupCheck: { [id: string]: IServer; } = {};
    let disabledGroup: IGroup = {
        id: 'disabled-group',
        name: 'Disabled',
        type: GroupTypeEnum.Disabled,
        servers: new Array<IServer>()
    };
    let countersDisabledGroupCheck: { [id: string]: IServer; } = {};
    let countersDisabledGroup: IGroup = {
        id: 'counters-disabled-group',
        name: 'Counters Disabled',
        type: GroupTypeEnum.CountersDisabled,
        servers: new Array<IServer>()
    };

    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        for (let j = 0; j < group.servers.length; j++) {
            let server = group.servers[j];
            switch (server.status) {
                case ServerStatus.Critical:
                    doGroupCheck(criticalGroup, server, criticalGroupCheck);
                    break;
                case ServerStatus.Warning:
                    doGroupCheck(warningGroup, server, warningGroupCheck);
                    break;
                case ServerStatus.Offline:
                    doGroupCheck(offlineGroup, server, offlineGroupCheck);
                    break;
                case ServerStatus.OK:
                    doGroupCheck(healthyGroup, server, healthyGroupCheck);
                    break;
                case ServerStatus.Disabled:
                    doGroupCheck(disabledGroup, server, disabledGroupCheck);
                    break;
                case ServerStatus.CountersDisabled:
                    doGroupCheck(countersDisabledGroup, server, countersDisabledGroupCheck);
                    break;
            }
        }
    }
    return [criticalGroup, warningGroup, healthyGroup, offlineGroup, disabledGroup, countersDisabledGroup];
}
