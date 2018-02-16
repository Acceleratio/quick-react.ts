import * as React from 'react';
import { Label } from '../Label/Label';
import { IDetailedServerProps, IProcessorUsage, IPartitionUsage, IMemoryUsage, IProcessorUsageData } from './DetailedServerTile.Props';
import { Icon } from '../Icon/Icon';
import { ServerStatus } from '../../models';
import { autobind } from '../../utilities/autobind';
import { TagContainer } from '../TagContainer/TagContainer';
import { LineChart } from '../LineChart/LineChart';
import { ILineChartProps, ILineChartData, ISeriesData } from '../LineChart/LineChart.props';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { GetClassForStatus } from '../../utilities/server';
import { PartitionTile } from '../PartitionTile';
import * as classNames from 'classnames';
import { ServerHeader } from '../ServerHeader/ServerHeader';
import { toPrettyString } from '../../utilities/valueFormatter';
import * as moment from 'moment';

import './DetailedServerTile.scss';

export class DetailedServerTile extends React.PureComponent<IDetailedServerProps, any> {
    public static defaultProps = {
        okColor: '#7DC458',
        warningColor: '#EAC71A',
        criticalColor: '#FB6464'
    };

    public render() {
        const className = GetClassForStatus('detailed-server-details', this.props.status);
        const partitionTileClass = this.props.partitionUsages.length === 1 ? 'partition-tile' : 'partition-col';
        const cpuDataProp = this.transformCPUdata(this.props.processorUsage.data);
        const cpuData = cpuDataProp[0].data;
        const startXTick = cpuData[0] ? cpuData[0].argument : Date.now();
        const endXTick = cpuData[cpuData.length - 1] ? cpuData[cpuData.length - 1].argument : new Date(Date.now() - 15 * 60000);

        let serverHoverMessage = this.props.hoverMessageForCriticalOrWarningServer && (this.props.status === ServerStatus.Critical || this.props.status === ServerStatus.Warning) ? this.props.hoverMessageForCriticalOrWarningServer : '';

        return (
            <div className={classNames(className, {'is-clickable': this.props.serverOnClick !== undefined && this.props.serverOnClick !== null})} onClick={this.serverOnClick} style={this.props.style} title={serverHoverMessage}>
                {this.props.onClose &&
                    <Icon disabled={false}
                        className={'dialog-button dialog-button-close'}
                        onClick={this.serverOnClose}
                        iconName={'icon-delete'} />
                }
                <ServerHeader
                    serverName={this.props.name}
                    numberOfUsers={this.props.numberOfUsers}
                    roles={this.props.roles}
                />
                {this.props.status !== ServerStatus.Offline && this.props.status !== ServerStatus.Disabled &&
                    <div className={'counters-container'}>
                        <LineChart
                            title={'CPU'}
                            dimensions={{ width: '100%', height: '220px' }}
                            series={cpuDataProp}
                            tickValues={[startXTick, endXTick]}
                            yAxisFormat={(d) => d + '%'}
                            xAxisFormat={() => '%H:%M'}
                            yAxisTicks={3}
                            xAxisTicks={3}
                            showLegend={false}
                            tooltipText={(d: ILineChartData) => toPrettyString(d.value, 0) + '%'}
                            colorPallette={['#686869']}
                        />
                        <ProgressBar
                            title={'Memory'}
                            info={this.getProgressInfo(this.props.memoryUsage)}
                            dimensions={{ height: '45px', width: '100%' }}
                            data={{ total: this.props.memoryUsage.capacity, current: this.props.memoryUsage.used }}
                            progressColor={this.getProgressColor()}
                        />
                        <div className={'partition-container'} >
                            <Label>Disks</Label>
                            {
                                this.props.partitionUsages.map((data, index) => <PartitionTile key={index} className={partitionTileClass} usage={data} />)
                            }
                        </div>
                    </div>
                }

                {this.props.status === ServerStatus.Offline &&
                    <div className={'counters-container'}>
                        <div className="offline-server-message">
                            <Icon iconName={'icon-Info_krug'}></Icon>
                            The server is offline!
                        </div>
                    </div>
                }
                {this.props.status === ServerStatus.Disabled &&
                    <div className={'counters-container'}>
                        <div className="offline-server-message">
                            <Icon iconName={'icon-Info_krug'}></Icon>
                            This server has performance counters disabled and is not monitored.
                        </div>
                    </div>
                }
            </div>
        );
    }

    @autobind
    private serverOnClose() {
        if (this.props.onClose) {
            this.props.onClose(this.props.id);
        }
    }

    @autobind
    private serverOnClick() {
        const { serverOnClick, id } = this.props;

        if (serverOnClick) {
            serverOnClick(id);
        }
    }

    private dismiss() {
        this.props.onClose(this.props.id);
    }

    private transformCPUdata(cpuData: Array<IProcessorUsageData>): Array<ISeriesData> {
        return [{
            name: 'CPU',
            data: cpuData.map((point) => { return { argument: moment.utc(point.time).local().toDate(), value: point.usage }; }),
            id: 'CPU'
        }];
    }

    private getProgressColor() {
        let status = this.props.memoryUsage.status;
        if (status === ServerStatus.Critical) {
            return this.props.criticalColor;
        } else if (status === ServerStatus.Warning) {
            return this.props.warningColor;
        } else if (status === ServerStatus.OK) {
            return this.props.okColor;
        }
        return undefined;
    }

    private getProgressInfo(memoryUsage: IMemoryUsage) {
        let used = '';
        let capacity = '';
        let usageUnit = '';

        if (memoryUsage.used >= 1000 || memoryUsage.capacity >= 1000) {
            used = toPrettyString(memoryUsage.used / 1024);
            capacity = toPrettyString(memoryUsage.capacity / 1024);
            usageUnit = 'GB';

        } else {
            used = toPrettyString(memoryUsage.used);
            capacity = toPrettyString(memoryUsage.capacity);
            usageUnit = 'MB';
        }

        return used + ' of ' + capacity + ' ' + usageUnit + ' used';
    }
}
