import * as React from 'react';
import { ITileGroupProps } from './TileGroup.Props';
import { ServerTile } from '../ServerTile/ServerTile';
import { Group } from '../Group/Group';
import * as classNames from 'classnames';
import { TagContainer } from '../TagContainer/TagContainer';
import { Icon } from '../Icon/Icon';
import { autobind } from '../../utilities/autobind';
import {
    getServerMeasures,
    sortServersByStatusAndName,
    filterServerByName,
    getDiskInformationFromMeasurements,
    filterServerByStatus
} from '../../utilities/server';

import './TileGroup.scss';

export class TileGroup extends React.PureComponent<ITileGroupProps, void> {

    public render(): JSX.Element {
        const { farm } = this.props;
        let servers = farm.servers.sort((server1, server2) => {
            return sortServersByStatusAndName(
                { status: server1.status, name: server1.name },
                { status: server2.status, name: server2.name }
            );
        });
        return (
            <Group
                editFunc={this.props.editGroup}
                serverChildrenCount={farm.servers.length}
                filter={this.props.filter}
                className={'farm-name-inside'}
                id={farm.id}
                name={farm.name}
                serversGroup={farm.serversGroup}
                key={farm.id.configDataBaseName + '-' + farm.id.sqlInstance}
                onClick={this.props.groupOnClick}>
                {
                    servers.map((server, serverIndex) => (
                        <ServerTile
                            key={serverIndex}
                            name={server.name}
                            id={server.id}
                            roles={server.roles}
                            status={server.status}
                            countersData={getServerMeasures(server.measures)}
                            serverOnClick={this.serverOnClick}
                            diskInformation={getDiskInformationFromMeasurements(server.measures)}
                        >
                            {
                                server.roles.length > 0 &&
                                <TagContainer title={''} tags={server.roles} >
                                    {this.props.editRoles &&
                                        <div className="edit-tags tag" title="Edit roles" onClick={(event) => this.editRoles(event, server.id)}>
                                            <Icon className="icon-edit"></Icon>
                                        </div>
                                    }
                                </TagContainer>
                            }
                        </ServerTile>
                    ))
                }
            </Group>
        );
    }

    @autobind
    private editRoles(event: any, id: any) {
        const { serverRoleEdit } = this.props;
        serverRoleEdit(event, id, this.props.farm.id);
    }

    @autobind
    private serverOnClick(serverId: any) {
        const { farm, serverOnClick } = this.props;

        if (serverOnClick) {
            serverOnClick(farm.id, serverId);
        }
    }
}
