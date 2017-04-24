import * as React from 'react';
import { ITileDashboardProps, ITiledDashboardFarm, ITiledDashboardServer } from './TileDashboard.Props';
import { ServerTile } from '../ServerTile/ServerTile';
import { ITileData } from '../ServerTile/ServerTile.Props';
const AutoSizer = require('react-virtualized').AutoSizer;
const List = require('react-virtualized').List;
import { Group } from '../Group/Group';
import { GroupHeader } from '../GroupHeader/GroupHeader';
import * as classNames from 'classnames';
import { TagContainer } from '../TagContainer/TagContainer';
import { Icon } from '../Icon/Icon';
import { autobind } from '../../utilities/autobind';
import { getServerMeasures, sortServersByStatusAndName, filterServerByName, filterServerByStatus } from '../../utilities/server';
import { TileGroup } from '../TileGroup';
import { filterFarms } from '../Dashboard/Dashboard';

import './TileDashboard.scss';

const serverTileWidth = 281.0; // LeftMargin 10px + LeftBodrder 10px + Server 250px + LeftBodrder 1px + RightMargin 10px
const servertileHeight = 236; // Server 52px + 2 * (Margin 8 + Padding 5 + border 1)
const scrollbarWidth = 13;
const farm_margin = 20;
const farm_padding = 5;
const headerTotalHeight = 65;
const totalPaddingHorizontal = 2 * (farm_margin + farm_padding) + scrollbarWidth;

export class TileDashboard extends React.Component<ITileDashboardProps, any> {
    private list: any;

    constructor(props?: ITileDashboardProps) {
        super(props);

        this.state = {
            farms: filterFarms(props.farms, props.filter)
        };
    }

    @autobind
    private componentDidUpdate(prevProps: ITileDashboardProps, prevState) {
        if ((this.props.filter !== prevProps.filter && this.list) || prevProps.farms !== this.props.farms) {
            this.list.recomputeRowHeights();
        }
    }

    public componentWillReceiveProps(nextProps: ITileDashboardProps, nextState: any) {
        if ((nextProps.filter !== this.props.filter) || (this.props.farms !== nextProps.farms)) {
            const filteredFarms = filterFarms(nextProps.farms, nextProps.filter);
            this.setState({ farms: filteredFarms });
        }
    }

    public render() {
        let { farms } = this.state;
        let classname = classNames({ [this.props.className]: this.props.className !== undefined });
        return (
            <div className={classname}>
                <div className="tile-dashboard-container">
                    {
                        <AutoSizer onResize={this._onResize}>
                            {({ width, height }) => (
                                <List
                                    height={height}
                                    ref={(reference) => {
                                        this.list = reference;
                                    } }
                                    rowCount={farms.length}
                                    rowHeight={function (index) {
                                        return this.calculateRowHeight(width, index);
                                    }.bind(this)}
                                    rowRenderer={this._renderRow}
                                    width={width}
                                    />
                            )}
                        </AutoSizer>
                    }
                </div>
            </div>
        );
    }

    @autobind
    _onResize() {
        this.list.recomputeRowHeights();
    }

    @autobind
    private calculateRowHeight(width, obj: { index: number }): number {
        const farm = this.getRow(obj.index);
        if (farm === undefined) {
            return 0;
        }
        const serversPerRow = Math.floor((width - totalPaddingHorizontal) / serverTileWidth);
        let farmServerCount = farm.servers.length;
        const rowCount = Math.ceil(farmServerCount / serversPerRow);
        const serverHeight = rowCount * servertileHeight;
        const totalHeight = serverHeight + headerTotalHeight;
        return totalHeight;
    }

    @autobind
    private getRow(index: number): ITiledDashboardFarm {
        return this.state.farms[index];
    }

    @autobind
    private _renderRow({ index, isScrolling, key, style }): JSX.Element {
        const farm = this.getRow(index);
        if (farm.servers.length === 0) {
            return;
        }
        
        return (
            <div style={style} key={index}>
                <TileGroup
                    farm={farm}
                    serverOnClick={this.props.serverOnClick}
                    groupOnClick={this.props.groupOnClick}
                    />
            </div>
        );
    }
}
