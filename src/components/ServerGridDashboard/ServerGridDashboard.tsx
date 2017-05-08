import * as React from 'react';
import { IServerGridDashboardProps, ServerGridRow, IServerGridDashboardState } from './ServerGridDashboard.Props';
import { ITiledDashboardFarm } from '../TileDashboard/TileDashboard.Props';
import * as classNames from 'classnames';
import { Icon } from '../Icon/Icon';
import { autobind } from '../../utilities/autobind';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { QuickGrid } from '../Grid/Grid';
import { IGridProps, GridColumn } from '../Grid/Grid.Props';
import { GetClassForStatus } from '../../utilities/server';
import { filterFarms } from '../Dashboard/Dashboard';

import { sortServersByStatusAndName, filterServerByName, convertNetwork, convertDisk, convertRam } from '../../utilities/server';
import { IMeasure, MeasureType, IFarm, Partition, DiskMeasure, CpuMeasure, RamMeasure, NetworkMeasure, ServerStatus } from '../../models';

import './ServerGridDashboard.scss';
class ServerGrid extends QuickGrid<ServerGridRow> { }



const gridColumns: Array<GridColumn> = [{
    valueMember: 'FarmName',
    headerText: 'Farm',
    width: 20,
    minWidth: 50
}, {
    valueMember: 'ServerName',
    headerText: 'Server',
    dataMember: 'ServerData',
    width: 20,
    minWidth: 200,
    cellFormatter: (cellData) => {
        return (
            <div className="server-column-cell">
                <div className={GetClassForStatus('server-status', cellData.status)}>&nbsp;</div>
                <span>{cellData.name}</span>
            </div>
        );
    },
    cellClassName: 'border-column-cell',
    isSortable: true
},
{
    valueMember: 'CPU',
    headerText: 'CPU (%)',
    dataMember: 'CPUData',
    width: 20,
    minWidth: 200,
    cellFormatter: (cellData) => { return <div className={GetClassForStatus('', cellData.status) + ' server-dashboard-grid-cell-content'} > {cellData.usage}</div>; },
    cellClassName: 'border-column-cell',
    isSortable: true
}, {
    valueMember: 'Memory',
    headerText: 'Memory',
    width: 20,
    minWidth: 200,
    dataMember: 'MemoryData',
    cellFormatter: (cellData) => { return <div className={GetClassForStatus('', cellData.status) + ' server-dashboard-grid-cell-content'}> {cellData.hoverText}</div>; },
    cellClassName: 'border-column-cell'
},
{
    valueMember: 'DiskActivity',
    headerText: 'Disk Activity',
    dataMember: 'DiskActivityData',
    width: 20,
    minWidth: 200,
    cellFormatter: (cellData) => { return <div className={GetClassForStatus('', cellData.status) + ' server-dashboard-grid-cell-content'}> {cellData.currentUsage + ' ' + cellData.usageUnit}</div>; },
    cellClassName: 'border-column-cell'
}, {
    valueMember: 'Network',
    headerText: 'Network',
    dataMember: 'NetworkData',
    width: 20,
    minWidth: 200,
    cellFormatter: (cellData) => { return <div className={GetClassForStatus('', cellData.status) + ' server-dashboard-grid-cell-content'}> {cellData.currentUsage + ' ' + cellData.usageUnit}</div>; }
}];

export class ServerGridDashboard extends React.Component<IServerGridDashboardProps, IServerGridDashboardState> {
    private grid;
    constructor(props: IServerGridDashboardProps) {
        super(props);
        this.state = {
            rows: this.transformFarmToRows(props.farms, props.filter),
            expandedRows: {},
            groupBy: ['FarmName'],
            sortColumn: 'ServerName',
            sortDirection: 'DESC'
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState((oldState) => {
            return { ...oldState, rows: this.transformFarmToRows(nextProps.farms, nextProps.filter) };
        });
    }
    
    private transformFarmToRows(farms: Array<ITiledDashboardFarm>, filter: string): Array<ServerGridRow> {
        const filteredFarms = filterFarms(farms, filter);
        let rows = [];
        const getMeasure = (measures, measureType) => {
            return measures.filter((mes) => { return mes.type === measureType; })[0];
        };
        filteredFarms.forEach(farm => {
            farm.servers.forEach(server => {
                const cpu = getMeasure(server.measures, MeasureType.CPU);
                const mem = getMeasure(server.measures, MeasureType.Ram);
                const disk = getMeasure(server.measures, MeasureType.Disk);
                const net = getMeasure(server.measures, MeasureType.Network);
                rows.push({
                    GroupId: farm.id,
                    ServerId: server.id,
                    FarmName: farm.name,
                    UserCount: server.numberOfUsers,
                    ServerName: server.name,
                    ServerData: { name: server.name, status: server.status },
                    CPU: cpu.usage,
                    CPUData: cpu,
                    Memory: mem.used,
                    MemoryData: convertRam(mem),
                    DiskActivity: disk.totalDiskIo,
                    DiskActivityData: convertDisk(disk),
                    Network: net.kbTotal,
                    NetworkData: convertNetwork(net)
                });
            });
        });
        return rows;
    }

    public render(): JSX.Element {
        const className = classNames({ [this.props.className]: this.props.className !== undefined }, 'server-grid-dashboard-container');
        return (
            <div className={className}>
                <ServerGrid
                    rows={this.state.rows}
                    columns={gridColumns}
                    groupBy={this.state.groupBy}
                    rowHeight={28}
                    headerHeight={28}
                    overscanRowCount={30}
                    onRowDoubleClicked={this.onRowDoubleClick}
                />
            </div>
        );
    }

    @autobind
    private onRowDoubleClick(row: ServerGridRow) {
        const { serverOnClick } = this.props;

        if (serverOnClick) {
            serverOnClick(row.GroupId, row.ServerId);
        }
    }
}

