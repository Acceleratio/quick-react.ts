import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { SortIndicator } from 'react-virtualized';
import { Icon } from '../Icon';
import { GridColumn, SortDirection } from './';
import * as classNames from 'classnames';

import './QuickGrid.scss';

export interface IHeaderColumnProps {
    valueMember: string;
    className: string;
    text: string;
    showSortIndicator: boolean;
    sortDirection?: SortDirection;
    onClick?: any;
    onKeyDown?: any;
    isGroupable?: boolean;
    moveGroupByColumn?: (draggedColumn, hoverColumn) => void;
    itemArrayIndex?: number;
    removeGroupColumn?: (columnName) => void;
    tooltipsEnabled?: boolean;

    // Drag&Drop props
    connectDragSource?: any;
    connectDragPreview?: any;
    connectDropTarget?: any;
}

class HeaderColumnInner extends React.PureComponent<IHeaderColumnProps, void> {
    public static defaultProps = {
        tooltipsEnabled: true
    };

    DragElement = <div style={{ height: 50, width: 30 }} > <span> Drag </span> </div>;
    render() {
        const { className, text, showSortIndicator, sortDirection, onClick, onKeyDown, tooltipsEnabled } = this.props;
        const sortIcon = sortDirection === SortDirection.Ascending ? 'icon-Arrow_up' : 'icon-arrow_down';
        const title = tooltipsEnabled ? text : null;
        return (
            this.props.connectDragSource(this.props.connectDropTarget(
                <div
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    key={`Header-Col${text}`}
                    className={className}
                >
                    <div className="header-text">
                        <span
                            key="label"
                            title={title}
                        >
                            {text}
                        </span>
                    </div>
                    {showSortIndicator &&
                        <Icon iconName={sortIcon} className="icon-sort" />
                    }
                </div>
            )
            ));
    }
}

const headerCellSource = {
    beginDrag(props: IHeaderColumnProps) {
        return {
            name: props.valueMember,
            index: props.itemArrayIndex
        };
    },
    canDrag(props: IHeaderColumnProps, monitor) {
        return props.isGroupable !== false;
    },
    endDrag(props, monitor) {
        const dropRes = monitor.getDropResult();
        if (dropRes == null || dropRes.handled == null) {
            if (props.removeGroupColumn) {
                props.removeGroupColumn(props.valueMember);
            }
        }
    }
};

function collectDragSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview()
    };
}

const headerCellDropTarget = {
    hover(props: IHeaderColumnProps, monitor, component) {
        const draggedItemIndex = monitor.getItem().index;
        const hoverItemIndex = props.itemArrayIndex;
        if (draggedItemIndex === undefined || hoverItemIndex === undefined) {
            return;
        }
        if (draggedItemIndex === hoverItemIndex) {
            return;
        }
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        if (draggedItemIndex < hoverItemIndex && clientOffset.x < hoverBoundingRect.left) {
            return;
        }
        if (draggedItemIndex > hoverItemIndex && clientOffset.x > hoverBoundingRect.right) {
            return;
        }
        props.moveGroupByColumn(draggedItemIndex, hoverItemIndex);
        monitor.getItem().index = hoverItemIndex;
    }
};

function collectDropTarget(connect) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}

export const HeaderColumn: React.ComponentClass<IHeaderColumnProps> =
    DropTarget('Column', headerCellDropTarget, collectDropTarget)(
        DragSource('Column', headerCellSource, collectDragSource)
            (HeaderColumnInner));
