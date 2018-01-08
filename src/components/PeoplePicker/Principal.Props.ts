import * as React from 'react';
import { Principal } from './Principal';

export interface IPrincipalProps extends React.Props<Principal> {
    principal?: IPrincipal;
    isSelected?: boolean;
    onSelect?(principal: IPrincipal): void;
    onDelete?(principal: IPrincipal): void;
}

export interface IPrincipal {
    id: number;
    displayName: string;
    email: string;
    type: PrincipalType;
}

export enum PrincipalType {
    user = 0,
    securityGroup = 1,
    sharePointGroup = 2, 
    activeDirectoryGroup = 3
}
