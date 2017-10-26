import { ICompactDashboardProps } from '../../src/components/CompactDashboard/CompactDashboard.Props';
import { IDetailedServerProps, IProcessorUsage, IPartitionUsage, IMemoryUsage, IProcessorUsageData } from '../../src/components/DetailedServerTile/DetailedServerTile.Props';
import { IGroup, IServer, GroupTypeEnum } from '../../src/models';

export const classListExample = {
    ok: 'green',
    warning: 'yellow',
    critical: 'red',
    offline: 'offline'
};

let roleListFarms = [{ display: 'WPF', iconName: 'icon-add' }, { display: 'WPF1111111', iconName: 'icon-add', tooltip: 'A long role named WPF2222222' }, { display: 'Not another', iconName: 'icon-add' }, { display: 'Search', iconName: 'icon-alert' }];

export const farms: Array<IGroup> = createFarms(10, 10, 10, true);
let serverIndexer = 0;

export function createFarms(numOfFarms: number, minServerCount: number, maxServerCount: number, hasRoles: boolean): Array<IGroup> {
    let _farms = new Array<IGroup>();
    for (let farmIndex = 0; farmIndex <= numOfFarms; farmIndex++) {
        let numOfServers = Math.floor(Math.random() * (maxServerCount - minServerCount + 1)) + minServerCount;
        let servers = [];
        for (let i = 0; i <= numOfServers; i++) {
            servers.push({
                id: 'server' + farmIndex + '' + i,
                name: 'server ' + farmIndex + '' + i,
                roles: hasRoles ? roleListFarms : [],                
                status: Math.random() >= 0.5 ? 1 : 2,
                type: Math.random() >= 0.5 ? GroupTypeEnum.SharePoint : GroupTypeEnum.Sql
            });
            serverIndexer++;
        }
        _farms.push({
            id: 'Demo Farm' + farmIndex,
            name: 'Demo Farm ' + farmIndex,
            servers: servers,
            type: GroupTypeEnum.SharePoint
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

export const DemoServerGroup: IGroup = {
    id: 'instance/configDb',
    name: 'demo server group',
    type: GroupTypeEnum.SharePoint,
    servers: [
        {
            id: 'FQDN1',
            name: 'server1',
            roles: roleListFarms,
            status: Math.random() >= 0.5 ? 1 : 2,
            numberOfUsers: '50111',
            memoryUsage: memoryUsage,
            partitionUsages: partitionUsages,
            processorUsage: processorUsage,
            measures: [],
            type: Math.random() >= 0.5 ? GroupTypeEnum.SharePoint : GroupTypeEnum.Sql
        },
        {
            id: 'FQDN2',
            name: 'server2',
            roles: roleListFarms,
            status: Math.random() >= 0.5 ? 1 : 2,
            numberOfUsers: '2351',
            memoryUsage: memoryUsage,
            partitionUsages: partitionUsages,
            processorUsage: processorUsage,
            measures: [],
            type: Math.random() >= 0.5 ? GroupTypeEnum.SharePoint : GroupTypeEnum.SqlAlwaysOn
        }
    ]
};
