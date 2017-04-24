import * as React from 'react';
import { ICompactDashboardProps } from './CompactDashboard.Props';
import { CompactFarm } from '../CompactFarm/CompactFarm';
import { ICompactFarmProps, ICompactDashboardFarm } from '../CompactFarm/CompactFarm.Props';
const List = require('react-virtualized').List;
const AutoSizer = require('react-virtualized').AutoSizer;
const Collection = require('react-virtualized').Collection;
import * as classNames from 'classnames';
import { IFarm, Partition } from '../../models';
import { autobind } from '../../utilities/autobind';
import { sortServersByStatusAndName, filterServerByName, filterServerByStatus } from '../../utilities/server';
import { ITiledDashboardFarm, ITiledDashboardServer } from '../TileDashboard/Tiledashboard.props';
import { filterFarms } from '../Dashboard/Dashboard';

import './CompactDashboard.scss';

const objectAssign = require('object-assign');

const GUTTER_SIZE = 3;
const CELL_WIDTH = 330;

const serverTileWidth = 252.0; // LeftMargin 8px + LeftBoarder 10px + LeftPadding 5px + Server 215px + RightPadding 5px + LeftBoarder 1px + RightMargin 8px
const serverTileHeight = 80; // Server 52px + 2 * (Margin 8 + Padding 5 + border 1)
const scrollbarWidth = 13;
const compactFarmMargin = 20;
const compactFarmPadding = 5;
const headerTotalHeight = 65; // Farm DIV size - serverTileHeight  
const totalPaddingHorizontal = 2 * (compactFarmMargin + compactFarmPadding) + scrollbarWidth;

export class CompactDashboard extends React.Component<ICompactDashboardProps, any> {
    collection: any;
    list: any;
    constructor(props?: ICompactDashboardProps) {
        super(props);
        this.state = {
            columnYMap: [],
            collection: undefined,
            list: undefined,
            farms: filterFarms(props.farms, props.filter)
        };
    }

    @autobind
    private componentDidUpdate(prevProps: ICompactDashboardProps, prevState) {
        if (this.props.isVertical === false && prevProps.isVertical === true) {
            this.setState({ columnYMap: [] });
        }
        if (this.props.filter !== prevProps.filter || (prevProps.farms !== this.props.farms)) {
            if (this.collection) {
                this.setState({ columnYMap: [] }, () => {
                    this.collection.recomputeCellSizesAndPositions();
                });
            }
            if (this.list) {
                this.list.recomputeRowHeights();
            }
        }
    }

    public componentWillReceiveProps(nextProps: ICompactDashboardProps, nextState) {
        const filteredFarms = filterFarms(nextProps.farms, nextProps.filter);
        this.setState({ farms: filteredFarms });
    }

    public render() {
        let { title } = this.props;
        let { farms } = this.state;
        let classname = classNames({ [this.props.className]: this.props.className !== undefined });
        return (
            <div className={classname}>
                {
                    this.props.isVertical &&
                    <div className="compact-dashboard-container vertical">
                        {
                            <AutoSizer  >
                                {({ width, height }) => (
                                    <Collection
                                        ref={(reference) => {
                                            this.collection = reference;
                                        } }
                                        verticalOverscanSize={5}
                                        cellCount={this.props.farms.length}
                                        cellRenderer={this._renderRow}
                                        cellSizeAndPositionGetter={function (index) {
                                            return this.cellSizeAndPositionGetter(width, index);
                                        }.bind(this)}
                                        height={height}
                                        width={width}
                                        />
                                )}
                            </AutoSizer>
                        }
                    </div>
                }
                {
                    !this.props.isVertical &&
                    <div className="compact-dashboard-container">
                        {
                            <AutoSizer onResize={this._onResize}>
                                {({ width, height }) => (
                                    <List
                                        height={height}
                                        width={width}
                                        rowCount={farms.length}
                                        ref={(reference) => {
                                            this.list = reference;
                                        } }
                                        rowHeight={function (index) {
                                            return this.getRowHeigth(width, index);
                                        }.bind(this)}
                                        rowRenderer={this._renderRow}
                                        />
                                )}
                            </AutoSizer>
                        }
                    </div>
                }
            </div>
        );
    }

    @autobind
    _onResize(obj: { height: number, width: number }) {
        this.list.recomputeRowHeights();
    }

    @autobind
    private getRowHeigth(width, obj: { index: number }): number {
        const farm = this.getRow(obj.index);
        if (farm === undefined) {
            return 0;
        }
        const serversPerRow = Math.floor((width - totalPaddingHorizontal) / serverTileWidth);
        let farmServerCount = farm.servers.length; 
        const rowCount = Math.ceil(farmServerCount / serversPerRow);
        const serverHeight = rowCount * serverTileHeight;
        const totalHeight = serverHeight + headerTotalHeight;
        return totalHeight;
    }

    @autobind
    private cellSizeAndPositionGetter(width, obj: { index: number }) {
        const columnCount = Math.floor((1800 - 72) / (CELL_WIDTH + GUTTER_SIZE));
        let row = this.getRow(obj.index);
        let columnPosition = obj.index % (columnCount || 1);
        let height = 120 + row.servers.length * 70;
        let serverRoleDiff = row.servers.length * 27;
        if (row.isCustom) {
            serverRoleDiff += 21;
        }
        height += serverRoleDiff;

        const cellWidth = CELL_WIDTH;
        const x = columnPosition * (GUTTER_SIZE + cellWidth);
        const y = this.state.columnYMap[columnPosition] || 0;

        this.state.columnYMap[columnPosition] = y + height + GUTTER_SIZE;

        return {
            height,
            width: cellWidth,
            x,
            y
        };
    }

    @autobind
    private getRow(index: number): IFarm {
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
                <CompactFarm
                    farm={farm as ICompactDashboardFarm}
                    filter={this.props.filter}
                    serverOnClick={this.props.serverOnClick}
                    groupOnClick={this.props.groupOnClick}
                />
            </div>
        );
    }
}
