import * as React from 'react';
import { ICompactFarmProps } from './CompactFarm.Props';
import { CompactServer } from '../CompactServer/CompactServer';
import { ServerTile } from '../ServerTile/ServerTile';
import { ITileData } from '../ServerTile/ServerTile.Props';
import { Group } from '../Group/Group';
import { GroupHeader } from '../GroupHeader/GroupHeader';
import * as classNames from 'classnames';
import { autobind } from '../../utilities/autobind';
import { getServerMeasures, sortServersByStatusAndName, filterServerByName, filterServerByStatus } from '../../utilities/server';
import { CommonComponent } from '../Common/Common';
import { Callout } from '../Callout/Callout';

import './CompactFarm.scss';
const HOVER_TIME = 500; // ms 

export class CompactFarm extends CommonComponent<ICompactFarmProps, any> {
    private _enterTimerId: number;
    constructor(props?: ICompactFarmProps) {
        super(props);
        this.state = {
            hoverServerId: null,
            hoverTargetElement: null
        };
        this._enterTimerId = 0;
    }

    private _onItemMouseEnter(serverId, ev: React.MouseEvent<HTMLElement>) {
        let targetElement = ev.currentTarget as HTMLElement;
        if (serverId !== this.state.hoverServerId) {
            this._enterTimerId = this._async.setTimeout(() => this._displayServerTile(serverId, targetElement), HOVER_TIME);
        }
    }

    private componentWillReceiveProps(nextProps) {
        this._onMouseLeave();
    }

    @autobind
    private _onMouseLeave(ev?: React.MouseEvent<HTMLElement>) {
        this._async.clearTimeout(this._enterTimerId);
        this._hideServerTile();
    }

    private _displayServerTile(serverId, target: HTMLElement) {
        if (this.state.hoverServerId !== serverId) {
            if (this.state.hoverServerId) {
                this._hideServerTile();
            }
            this.setState({
                hoverServerId: serverId,
                hoverTargetElement: target
            });
        }
    }

    @autobind
    private _hideServerTile() {
        this.setState({
            hoverServerId: null,
            hoverTargetElement: null
        });
    }

    @autobind
    private _renderServerTile(serverId): JSX.Element {
        const server = this.props.farm.servers.filter((currServer) => { return currServer.id === serverId; })[0];
        return (
            <ServerTile
                name={server.name}
                id={server.id}
                roles={server.roles}
                status={server.status}
                countersData={getServerMeasures(server.measures)}>
            </ServerTile>
        );
    }

    @autobind _onServerClicked(serverId: any) {
        const {serverOnClick, farm} = this.props;

        if (serverOnClick) {
            serverOnClick(farm.id, serverId);
        }
    }

    public render() {
        const farm = this.props.farm;
        let servers = farm.servers.sort((server1, server2) => {
            return sortServersByStatusAndName(
                {status: server1.status, name: server1.name}, 
                {status: server2.status, name: server2.name}
            );
        });

        return (
            <div className={'compact-farm'}>
                <Group
                    serverChildrenCount={servers.length}
                    className={'farm-name-inside'}
                    id={farm.id} name={farm.name}
                    key={farm.id.configDataBaseName + '-' + farm.id.sqlInstance}
                    onClick={this.props.groupOnClick}
                    >
                    {
                        servers.map((server) => (
                            <CompactServer
                                key={server.id.FQDN}
                                roles={server.roles}
                                id={server.id}
                                status={server.status}
                                onRoleEdit={server.onRoleEdit}
                                onClose={server.onClose}
                                name={server.name}
                                serverOnClick={this._onServerClicked}
                                onMouseEnter={this._onItemMouseEnter.bind(this, server.id)}
                                onMouseLeave={this._onMouseLeave}
                                />
                        ))
                    }
                    {
                        this.state.hoverServerId &&
                        <Callout
                            targetElement={this.state.hoverTargetElement}
                            hideBorder
                            isBeakVisible={false}
                            gapSpace={5}>
                            {this._renderServerTile(this.state.hoverServerId)}
                        </Callout>
                    }
                </Group>
            </div>
        );
    }
}
