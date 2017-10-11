import * as React from 'react';
import { GridColumn, SortDirection, IGroupBy } from './QuickGrid.Props';
import { Icon } from '../Icon/Icon';
import * as _ from 'lodash';
import { DropTarget } from 'react-dnd';
import * as classNames from 'classnames';
import { HeaderColumn, IHeaderColumnProps } from './HeaderColumn';
import { shallowCompareArrayEqual } from '../../utilities/array';
import './QuickGrid.scss';

export interface IGroupByProps {
    groupBy: Array<IGroupBy>;
    columns: Array<GridColumn>;
    onGroupByRemoved: (groupName: string) => void;
    onGroupByChanged: (newGroupBy: Array<IGroupBy>) => void;
    onSort: (sortBy: string, sortDirection: SortDirection) => void;
    onCollapseAll: (event) => void;
    onExpandAll: (event) => void;

    // Drag&Drop props
    canDrop?: any;
    isOver?: any;
    connectDropTarget?: any;
}
export interface IGroupByState {
    groupBy: Array<IGroupBy>;
}

class GroupByToolbarInner extends React.PureComponent<IGroupByProps, IGroupByState> {
    constructor(props: IGroupByProps) {
        super(props);
        this.state = {
            groupBy: props.groupBy
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!shallowCompareArrayEqual(nextProps.groupBy, this.props.groupBy)) {
            this.setState((prevState) => { return { ...prevState, groupBy: nextProps.groupBy }; });
        }
    }

    createHeaderColumn(groupBy: IGroupBy, index: number) {
        const columnDefinition = _.find(this.props.columns, (col: GridColumn) => { return col.valueMember === groupBy.column; });
        const { headerText, isSortable, headerClassName, valueMember } = columnDefinition;
        const columnClassName = classNames('header-column-content', 'group-by-column', headerClassName, { 'header-column-sortable': isSortable });
        const newSortDirection = groupBy.sortDirection === SortDirection.Descending ? SortDirection.Ascending : SortDirection.Descending;

        const onChangeSortDirection = (event) => {
            if (isSortable !== false) {
                this.props.onSort(valueMember, newSortDirection);
            }
        };

        const onKeyDown = (event) => {
            if (isSortable !== false && (event.key === 'Enter' || event.key === ' ')) {
                onChangeSortDirection(event);
            }
        };

        const removeGroup = () => {
            this.props.onGroupByRemoved(valueMember);
        };
        return (
            <div key={valueMember} className="group-column-box">
                <span className="group-text-boarder">
                    <span  >
                        <HeaderColumn
                            valueMember={columnDefinition.valueMember}
                            text={headerText}
                            showSortIndicator={true}
                            sortDirection={groupBy.sortDirection}
                            className={columnClassName}
                            isGroupable={columnDefinition.isGroupable}
                            onClick={onChangeSortDirection}
                            onKeyDown={onKeyDown}
                            moveGroupByColumn={this.groupOrderChange}
                            itemArrayIndex={index}
                            removeGroupColumn={this.props.onGroupByRemoved}
                        />
                    </span>
                    <Icon iconName="icon-delete" className="icon-remove-group" onClick={removeGroup} />
                </span>
            </div>

        );
    }

    groupOrderChange = (draggedColumnIndex, hoverColumnIndex) => {
        this.setState((prevState) => {
            let groupBy = [...prevState.groupBy];
            let temp = groupBy[draggedColumnIndex];
            groupBy[draggedColumnIndex] = groupBy[hoverColumnIndex];
            groupBy[hoverColumnIndex] = temp;
            return { ...prevState, groupBy: groupBy };
        });
    }

    render() {
        const { connectDropTarget, columns, onGroupByRemoved, onCollapseAll, onExpandAll } = this.props;
        const isEmpty = _.isEmpty(this.state.groupBy);
        return connectDropTarget(
            <div className="group-drop-toolbar">
                {
                    isEmpty && <span className="group-drop-empty">Drag column to group</span>
                }
                {
                    this.state.groupBy.map((groupBy, index) => {
                        return this.createHeaderColumn(groupBy, index);
                    })
                }
                {!isEmpty &&
                    <div
                        className="expand-collapse-buttons"
                    >
                        <Icon
                            iconName="icon-expandAll"
                            className="expand"
                            onClick={onExpandAll}
                            title="Expand all"
                        />

                        <Icon
                            iconName="icon-expand_collapse"
                            className="collapse"
                            onClick={onCollapseAll}
                            title="Collapse all"
                        />
                    </div>
                }
            </div>
        );
    }
}

const boxTarget = {
    drop(props: IGroupByProps, monitor, component) {
        const item = monitor.getItem();
        const alreadyGrouped = _.find(props.groupBy, groupByColumn => groupByColumn.column === item.name);
        if (!alreadyGrouped) {
            let groupBy: Array<IGroupBy> = [...props.groupBy];
            groupBy.push({
                column: item.name,
                sortDirection: SortDirection.Ascending
            });
            props.onGroupByChanged(groupBy);
        } else {
            const droppedItem = monitor.getItem();
            const droppedItemNewIndex = droppedItem.index;
            let newGroupBy: Array<IGroupBy> = [...props.groupBy];
            const itemOldIndex = _.findIndex(newGroupBy, group => group.column === droppedItem.name);
            if (itemOldIndex === droppedItemNewIndex) {
                return { handled: true };
            }
            let temp = newGroupBy[itemOldIndex];
            newGroupBy[itemOldIndex] = newGroupBy[droppedItemNewIndex];
            newGroupBy[droppedItemNewIndex] = temp;
            props.onGroupByChanged(newGroupBy);
        }
        return { handled: true };
    }
};

function targetConnector(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

export const GroupByToolbar: React.ComponentClass<IGroupByProps> = DropTarget('Column', boxTarget, targetConnector)(GroupByToolbarInner);
