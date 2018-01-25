import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { ITreeGridProps, ITreeGridState } from './TreeGrid.Props';

import { getTreeRowsSelector } from './treeGridDataSelectors';
import { Icon } from '../Icon/Icon';
import { QuickGrid, IQuickGridProps, SortDirection, GridColumn } from '../QuickGrid';
import { DataTypeEnum } from '../QuickGrid/QuickGrid.Props';
import { CellElement } from './CellElement';
import { Spinner } from '../Spinner/Spinner';
import { SpinnerType } from '../Spinner/Spinner.Props';
import { IFinalTreeNode } from '../../models/TreeData';



export class TreeGrid extends React.PureComponent<ITreeGridProps, ITreeGridState> {

    private finalGridRows: Array<IFinalTreeNode>;
    constructor(props: ITreeGridProps) {
        super(props);
        this.state = {
            columnsToDisplay: this.getTreeColumnsToDisplay(props.columns),
            sortColumn: props.sortColumn,
            sortDirection: props.sortDirection,
            sortRequestId: 0,
            structureRequestChangeId: 0
        };
        this.finalGridRows = getTreeRowsSelector(this.state, props);
    }

    getTreeColumnsToDisplay(columns: Array<GridColumn>) {
        let emptyArray = new Array();
        emptyArray.push({
            isSortable: false,
            width: 18,
            minWidth: 30,
            fixedWidth: true
        });
        emptyArray.push({
            dataType: DataTypeEnum.String,
            valueMember: 'TreeId',
            headerText: 'TreeId',
            width: 0
        });
        columns = emptyArray.concat(columns);
        return columns;
    }
   
    componentWillReceiveProps(nextProps) {
        if (this.props.treeDataSource !== nextProps.treeDataSource) {
            this.setState(oldState => ({ sortRequestId: oldState.sortRequestId + 1, structureRequestChangeId: oldState.structureRequestChangeId + 1 }));           
        }
    }

    componentWillUpdate(nextProps, nextState) {
        this.finalGridRows = getTreeRowsSelector(nextState, nextProps);
    }

    treeCellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const rowData = this.finalGridRows[rowIndex];
        const rowID: number = rowData.nodeId;
        const indentSize = 20;
        let indent = 0;
        let level = rowData.nodeLevel;
        if ((columnIndex === 0 || columnIndex === 2)) {

            indent = level * indentSize;
        }
        let shouldIndent: boolean = false;
        if (columnIndex === 0) {
            if (level === 0) {
                shouldIndent = false;
            } else if (style.left < indent) {
                shouldIndent = true;
            }
        } else if (columnIndex === 2) {
            if (level === 0) {
                shouldIndent = false;
            } else if (style.left < (indent + indentSize)) {
                shouldIndent = true;
            }
        }
        if (columnIndex === 1) {
            return this.renderHiddenTreeCell(key, columnIndex, rowID);
        }
        if (columnIndex === 2 && shouldIndent) {
            style = { ...style, width: style.width - indent };
        }
        if (shouldIndent) {
            style = { ...style, left: style.left + indent };
        }
        if (columnIndex === 0) {
            return this.renderActionTreeCell(key, rowIndex, rowData, style);
        }
        return this.renderBodyCell(columnIndex, key, rowIndex, rowData, style);
    }

    renderHiddenTreeCell(key, columnIndex, rowData) {
        const style = {
            display: 'none'
        };
        return (
            <div key={key} style={style}>
                {rowData}
            </div>);
    }

    renderActionTreeCell(key, rowIndex: number, rowData: IFinalTreeNode, style) {
        let actionsTooltip = rowData.isExpanded ? 'Collapse' : 'Expand';
        let iconName = rowData.isExpanded ? 'icon-arrow_down' : 'icon-arrow_right';
        let icon = null;

        if (rowData.children.length <= 0 && !rowData.hasChildren) {
            icon = null;
            actionsTooltip = null;
        } else {
            icon = <Icon iconName={iconName} className="expand-collapse-action-icon" />;
        }
        const rowClass = 'grid-row-' + rowIndex;
        const title = actionsTooltip;
        const className = classNames(
            'grid-component-cell',
            rowClass,
            { 'is-selected': rowIndex === this.state.selectedRowIndex }
        );
        return (
            <CellElement
                key={key}
                id={key}
                style={style}
                className={className}
                title={title}
                onMouseEnter={this.onMouseEnterCell}
                onMouseLeave={this.onMouseLeaveCell}
                onClick={icon ? this.onTreeExpandToggleClick : null}
                onClickParameter={rowData}
                rowClass={rowClass}
                rowData={rowData}
                element={icon}
            />
        );
    }

    renderBodyCell(columnIndex: number, key, rowIndex: number, rowData, style) {
        const columns = this.state.columnsToDisplay;
        const notLastIndex = columnIndex < (columns.length - 1);
        const column = columns[columnIndex];
        const dataKey = column.dataMember || column.valueMember;
        const cellData = rowData[dataKey];
        const rowClass = 'grid-row-' + rowIndex;
        const className = classNames(
            'grid-component-cell',
            rowClass,
            column.cellClassName,
            { 'border-column-cell': notLastIndex },
            { 'is-selected': rowIndex === this.state.selectedRowIndex });

        let columnElement: JSX.Element;
        if (rowData.isAsyncLoadingNode && columnIndex === 2) {
            columnElement = <div className="loading-container">
                <Spinner className="async-loading-spinner"
                    type={SpinnerType.small}
                />
                <span className="async-loading-label">
                    Loading...
                    </span>
            </div>;
        } else if (column.cellFormatter) {
            columnElement = column.cellFormatter(cellData, rowData);
        } else {
            columnElement = (
                <div style={{ padding: '3px 5px 0 5px' }} >
                    {columnIndex === 2 && rowData.iconName ? <Icon iconName={rowData.iconName} /> : null}
                    {cellData}
                </div>
            );
        }

        const title = cellData;
        return (
            <CellElement
                key={key}
                id={key}
                style={style}
                className={className}
                title={title}
                onMouseEnter={this.onMouseEnterCell}
                onMouseLeave={this.onMouseLeaveCell}
                onClick={this.setSelectedRowIndex}
                onClickParameter={rowIndex}
                onRowDoubleClicked={this.props.onRowDoubleClicked}
                rowClass={rowClass}
                rowData={rowData}
                element={columnElement}
            />
        );
    }

    setSelectedRowIndex = (rowIndex: number) => {
        this.setState((prevState) => { return { ...prevState, selectedRowIndex: rowIndex }; });
        if (this.props.onSelectedRowChanged) {
            this.props.onSelectedRowChanged(rowIndex);
        }
    }

    onTreeExpandToggleClick = (rowData: IFinalTreeNode) => {
        // we are breaking immutability here and potential redux stores, but we need the performance
        rowData.isExpanded = !rowData.isExpanded;
        if (rowData.isExpanded && rowData.children.length === 0 && rowData.hasChildren && this.props.onLoadChildNodes) {          
            this.props.onLoadChildNodes(rowData);
        }
        this.setState((oldState) => {
            return { structureRequestChangeId: oldState.structureRequestChangeId + 1 };
        });

    }

    onMouseEnterCell = (rowClass) => {
        const rowElements = document.getElementsByClassName(rowClass);
        for (let i = 0; i < rowElements.length; i++) {
            rowElements[i].classList.add('is-hover');
        }
    }

    onMouseLeaveCell = (rowClass) => {
        const rowElements = document.getElementsByClassName(rowClass);
        for (let i = 0; i < rowElements.length; i++) {
            const classList = rowElements[i].classList;
            if (classList.contains('is-hover')) {
                classList.remove('is-hover');
            }
        }
    }

    getSortInfo = (newSortColumn, newSortDirection) => {
        this.setState(oldState => ({ sortColumn: newSortColumn, sortDirection: newSortDirection, sortRequestId: oldState.sortRequestId + 1 }));
    }

    public render(): JSX.Element {
        return (
            <QuickGrid
                rows={this.finalGridRows}
                columns={this.state.columnsToDisplay}
                sortDirection={this.state.sortDirection}
                sortColumn={this.state.sortColumn}
                tooltipsEnabled={false}
                customCellRenderer={this.treeCellRenderer}
                hasCustomRowSelector={true}
                hasStaticColumns={true}
                customRowSorter={this.getSortInfo}
                columnSummaries={this.props.columnSummaries}
            />
        );
    }
}
