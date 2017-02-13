import * as React from 'react';

export enum ServerStatus {
    OK = 0,
    Warning = 1,
    Critical = 2
}

export interface IClassNames {
    ok: string;
    warning: string;
    critical: string;
}

export interface ICompactServerProps {
    serverId: any;
    serverName: string;
    roleList: Array<{display: string, iconName: string, className?: string}>;
    status: ServerStatus;
    classNameList: IClassNames;
    onRoleEdit: (serverId?: any) => void; 
    onServerClose: (serverId?: any) => void;
}
