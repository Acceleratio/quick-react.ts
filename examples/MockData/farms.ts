import { ICompactDashboardProps } from '../../src/components/CompactDashboard/CompactDashboard.Props';
import { IDetailedServerProps, IProcessorUsage, IPartitionUsage, IMemoryUsage, IProcessorUsageData } from '../../src/components/DetailedServerTile/DetailedServerTile.Props';
import { IDetailedServerGroup } from '../../src/components/DetailedServerGroup/DetailedServerGroup.Props';

import { IFarm } from '../../src/models';

export const classListExample = {
    ok: 'green',
    warning: 'yellow',
    critical: 'red',
    offline: 'offline'
};

let roleListFarms = [{ display: 'WPF', iconName: 'icon-add' }, { display: 'WPF1111111', iconName: 'icon-add' }, { display: 'Not another', iconName: 'icon-add' }, { display: 'Search', iconName: 'icon-alert' }];

export const farms: Array<IFarm> = createFarms(50, 10, 10);

export function createFarms(numOfFarms: number, minServerCount: number, maxServerCount: number) {
    let _farms = Array(0);
    for (let farmIndex = 0; farmIndex <= numOfFarms; farmIndex++) {
        let numOfServers = Math.floor(Math.random() * (maxServerCount - minServerCount + 1)) + minServerCount;
        let servers = [];
        for (let i = 0; i <= numOfServers; i++) {
            servers.push({
                id: 'server' + i,
                name: 'server ' + i,
                roles: roleListFarms,
                status: Math.random() >= 0.5 ? 1 : 2
            });
        }
        _farms.push({
            id: 'Demo Farm' + farmIndex,
            name: 'Demo Farm ' + farmIndex,
            isCustom: Math.random() >= 0.5,
            version: {
                version: '14',
                icon: 'icon-SharePoint'
            },
            servers: servers,
            serversGroup: {
                icon: farmIndex % 2 === 0 ? 'icon-SharePoint' : 'icon-database',
                name: farmIndex % 2 === 0 ? 'SharePoint' : 'SQL Server'
            }
        });
    }
    return _farms;
}

const memoryUsage: IMemoryUsage = { usageUnit: 'MB', capacity: 1024, used: 300, status: 1 };

function createProcessorUsages(): Array<IProcessorUsageData> {
    let time = new Date();
    time.setSeconds(0);
    let cpuUsage = [];
    for (let i = 0; i < 15; i++) {
        cpuUsage.push({
            time: new Date(time.getTime()),
            usage: Math.round(Math.random() * 100)
        });
        time.setSeconds(time.getSeconds() + 20);
    }
    return cpuUsage;
}

const processorUsage: IProcessorUsage = { data: createProcessorUsages(), status: 1 };

const partitionUsages: Array<IPartitionUsage> = [
    { name: 'C', usageUnit: 'GB', capacity: 60, used: 20, status: 0 },
    { name: 'D', usageUnit: 'GB', capacity: 200, used: 142.5, status: 1 },
    { name: 'E', usageUnit: 'GB', capacity: 52.4, used: 33.2, status: 2 },
    { name: 'F', usageUnit: 'GB', capacity: 550, used: 512, status: 0 }
];
const roleList = [{ display: 'Web', iconName: 'icon-site2' }, { display: 'SQL', iconName: 'icon-sql_log' }, { display: 'FireWall', iconName: 'icon-logOut' }];

export const DemoServerGroup: IDetailedServerGroup = {
    id: { sqlInstance: 'instance', configDataBaseIcon: 'icon-sql_log', configDataBaseName: 'db' },
    name: 'demo server group',
    isCustom: Math.random() >= 0.5,
    version: {
        version: '14',
        icon: 'icon-SharePoint'
    },
    serversGroup: {
        icon: 'icon-SharePoint',
        name: 'SharePoint'
    },
    servers: [
        {
            id: { FQDN: 'FQDN1' },
            name: 'server1',
            roles: roleListFarms,
            status: Math.random() >= 0.5 ? 1 : 2,
            numberOfUsers: '50111',
            memoryUsage: memoryUsage,
            partitionUsages: partitionUsages,
            processorUsage: processorUsage
        },
        {
            id: { FQDN: 'FQDN2' },
            name: 'server2',
            roles: roleListFarms,
            status: Math.random() >= 0.5 ? 1 : 2,
            numberOfUsers: '2351',
            memoryUsage: memoryUsage,
            partitionUsages: partitionUsages,
            processorUsage: processorUsage
        }
    ]
};
