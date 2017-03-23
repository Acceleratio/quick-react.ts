import { ICompactDashboardProps } from '../../src/components/CompactDashboard/CompactDashboard.Props';
import { IFarm } from '../../src/models';

export const classListExample = {
    ok: 'green',
    warning: 'yellow',
    critical: 'red',
    offline: 'offline'
};


let roleListFarms = [{ display: 'WPF', iconName: 'icon-add' }, { display: 'WPF1111111', iconName: 'icon-add' }, { display: 'Not another', iconName: 'icon-add' }, { display: 'Search', iconName: 'icon-alert' }];
export const farms: Array<IFarm> = [
    {
        id: { sqlInstance: 'instanca1', configDataBaseIcon: '', configDataBaseName: 'db1' },
        name: 'farm1',
        isCustom: false,
        version: {
            version: '14',
            icon: 'icon-SharePoint'
        },
        servers: [
            {
                id: {
                    FQDN: 'FQDN1'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN2'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN3'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN4'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN5'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN6'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN7'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN8'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN9'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN10'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            }
        ]
    },
    {
        id: { sqlInstance: 'instanca2', configDataBaseIcon: '', configDataBaseName: 'db2' },
        name: 'farm2',
        isCustom: true,
        version: {
            version: '15',
            icon: 'icon-SharePoint'
        },
        servers: [
            {
                id: {
                    FQDN: 'FQDN1'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN2'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN3'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN4'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN5'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN6'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN7'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN8'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN9'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN10'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            }
        ]
    },
    {
        id: { sqlInstance: 'instanca3', configDataBaseIcon: '', configDataBaseName: 'db3' },
        name: 'farm1',
        isCustom: false,
        version: {
            version: '14',
            icon: 'icon-SharePoint'
        },
        servers: [
            {
                id: {
                    FQDN: 'FQDN4'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN5'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN6'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN7'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN8'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN9'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN10'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            }
        ]
    },
    {
        id: { sqlInstance: 'instanca4', configDataBaseIcon: '', configDataBaseName: 'db4' },
        name: 'farm2',
        isCustom: true,
        version: {
            version: '15',
            icon: 'icon-SharePoint'
        },
        servers: [
            {
                id: {
                    FQDN: 'FQDN8'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            },
            {
                id: {
                    FQDN: 'FQDN9'
                },
                name: 'server1',
                roles: roleListFarms,
                status: 1
            },
            {
                id: {
                    FQDN: 'FQDN10'
                },
                name: 'server2',
                roles: roleListFarms,
                status: 2
            }
        ]
    }
];


