import * as React from 'react';
import {ISharePointServer, ServerStatus } from '../../models';

export interface IDetailedServerProps extends ISharePointServer {
    numberOfUsers?: string;
    memoryUsage?: IMemoryUsage;
    partitionUsages?: Array<IPartitionUsage>;
    processorUsage?: IProcessorUsage;
    serverOnClick?: (serverId: any) => void;
}

export interface IProcessorUsage {
    data: Array<IProcessorUsageData>;
    status: ServerStatus;
}

export interface IProcessorUsageData {
    time: Date;
    usage: number;
}

export interface IPartitionUsage {
    className?: string;
    id: string;
    name: string;
    usageUnit: string;
    capacity: number;
    used: number;
    status: ServerStatus;    
}

export interface IMemoryUsage {
    usageUnit: string;
    capacity: number;
    used: number;
    status: ServerStatus;
}
