import * as React from 'react';
import { Principal } from './Principal';

export interface IPrincipalProps extends React.Props<Principal> {
    principal?: IPrincipal;
    isSelected?: boolean;
    isDisabled?: boolean;
    onSelect?(principal: IPrincipal): void;
    onDelete?(principal: IPrincipal): void;
}

export interface IPrincipal {
    identifier: string;
    spid?: number;
    displayName: string;
    email: string;
    type: PrincipalType;
}

export enum PrincipalType {
    sharePointGroup = 1,
    user = 2,
    activeDirectoryGroup = 3,
    securityGroup = 4
}
