import * as React from 'react';
import { ISharePointServer, IHazMeasures, IFarm } from '../../models';
import { ITiledDashboardFarm } from '../TileDashboard/TileDashboard.Props';

export interface IServerGridDashboardProps {
    farms: Array<ITiledDashboardFarm>;
    className?: string;
    serverOnClick?: (groupId: any, serverId: any) => void;
    filter: string;
}
export interface ServerGridRow {
    type: 'DataRow';
    GroupId: any;
    ServerId: any;
    FarmName: string;
    UserCount: string;
    CPU: number;
    Memory: number;
    Disk: number;
    DiskActivity: number;
    Network: number;
    LastUpdated: number;
}

export interface IServerGridDashboardState {
    rows: Array<ServerGridRow>;
    groupBy: Array<string>;
    expandedRows: any;
    sortColumn: string;
    sortDirection: any;
}
