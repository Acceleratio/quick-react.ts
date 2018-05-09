import * as React from 'react';
import { Principal } from './Principal';

export interface IPrincipalProps extends React.Props<Principal> {
    principal?: IPrincipal;
    isSelected?: boolean;
    isDisabled?: boolean;
    iconName?: string;
    iconClassName?: string;
    isFocused?: boolean;
    onSelect?(principal: IPrincipal): void;
    onDelete?(principal: IPrincipal): void;
    onWillUnmount?(principalId: string): void;
    onMouseOver?(principalId: string): void;
}

export interface IPrincipal {
    identifier: string;
    spid?: number;
    displayName: string;
    displayIdentifier?: string;
    email: string;
    type: PrincipalType;
    isUnifiedSecurityGroup?: boolean;
}

export enum PrincipalType {
    sharePointGroup = 1,
    user = 2,
    activeDirectoryGroup = 3,
    securityGroup = 4
}
