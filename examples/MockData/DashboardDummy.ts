/* tslint:disable:no-console */
import { ICompactDashboardProps, ICompactDashboardServer, ICompactDashboardFarm } from '../../src/components/CompactDashboard';
import { ITileDashboardProps, ITiledDashboardFarm, ITiledDashboardServer } from '../../src/components/TileDashboard';
import { IDashboardProps } from '../../src/components/Dashboard';
import { ActiveDashboard } from '../../src/components/DashboardHeader/DashboardHeader.Props';
import { IFarm, ServerStatus, IMeasure, MeasureType, CpuMeasure, Partition, DiskMeasure, NetworkMeasure, RamMeasure } from '../../src/models';
import { farms } from './farms';

export const dummyCompact: ICompactDashboardProps = {
    title: 'My compact dashboard',
    farms: farms.map(convertFarm),
    className: '',
    filter: '',
    isVertical: false

};

export const dummyTiles: ITileDashboardProps = {
    className: '',
    filter: '',
    farms: farms.map(convertFarm)
};

export const dummyDashboard: IDashboardProps = {
    title: 'Dummy dashboard',
    filter: '',
    initialActiveView: 0,
    hasAddButton: true,
    headerClass: '',
    differentDashboards: { 0: { linkText: 'Compact Horizontal' }, 2: { linkText: 'Tiles' }, 1: { linkText: 'Compact Vertical' }, 3: { linkText: 'Grid' } },
    farms: farms.map(convertFarm),
    addFarm: () => { console.log('Adding new farm, wop wop'); },
    groupAddFunc: (groupId: any) => { console.log('Clicked add icon of group ' + groupId); },
    groupDeleteFunc: (groupId: any) => { console.log('Clicked delete icon of group ' + groupId); },
    groupEditFunc: (groupId: any) => { console.log('Clicked edit icon of group ' + groupId); },
    serverClose: (serverFQDN: any) => { console.log('Clicked close icon of server ' + serverFQDN); },
    serverRoleEdit: (serverFQDN: any) => { console.log('Clicked edit role icon of server ' + serverFQDN); },
    groupOnClick: (groupId: any) => { console.log('Clicked on group ' + groupId); },
    serverOnClick: (groupId: any, serverId: any) => {console.log('Clicked on group ' + groupId + ' and server ' + serverId); }    
};

export function convertFarm(farm: IFarm): ITiledDashboardFarm {
    let servers = farm.servers.map((server) => {
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
        return {
            id: server.id,
            numberOfUsers:  Math.round(Math.random() * 1000).toString(),
            name: server.name,
            onClose: server.onClose,
            onRoleChange: server.onRoleChange,
            onRoleEdit: server.onRoleEdit,
            roles: server.roles,
            status: status,
            measures: measures
        };
    });
    return {
        servers: servers,
        name: farm.name,
        id: farm.id,
        isCustom: farm.isCustom,
        version: farm.version
    };
}

function convertToCompactFarm(farm: ITiledDashboardFarm): ICompactDashboardFarm {
    return farm;
}

export function generatePercentage() {
    return Math.floor(Math.random() * (100 - 0 + 1)) + 0;
}

export function generateCpuSpeed() {
    return Math.random() * (2 - 0.1 + 1);
}

export function generateCoreCount() {
    return Math.floor(Math.random() * (4 - 1 + 1)) + 1;
}

export function generateNetworkSpeed() {
    return Math.random() * (2000 - 0.1 + 1);
}

export function generateRandomStatus() {
    return Math.floor(Math.random() * (4 - 0 + 1)) + 0;
}

export function generateMeasures(): Array<IMeasure> {
    let cpuMeasure: CpuMeasure = {
        type: MeasureType.CPU,
        status: generateRandomStatus(),
        usage: generatePercentage(),
        speed: generateCpuSpeed(),
        coreCount: generateCoreCount(),
        logicalCoreCount: generateCoreCount(),
        name: 'Dummy CPU',
        time: new Date(Date.now())
    };
    let ramMeasure: RamMeasure = {
        type: MeasureType.Ram,
        status: generateRandomStatus(),
        used: generatePercentage(),
        capacity: generatePercentage() + 100,
        time: new Date(Date.now())
    };
    let networkMeasure: NetworkMeasure = {
        type: MeasureType.Network,
        status: generateRandomStatus(),
        kbTotal: generateNetworkSpeed(),
        time: new Date(Date.now())
    };
    let diskMeasure: DiskMeasure = {
        type: MeasureType.Disk,
        status: generateRandomStatus(),
        totalDiskIo: generateNetworkSpeed(),
        partitions: [
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
        ],
        time: new Date(Date.now())
    };
    return [cpuMeasure, ramMeasure, networkMeasure, diskMeasure];
}

