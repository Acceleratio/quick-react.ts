import * as React from 'react';
import { ITreeCompareProps, ITreeCompareState, ICompareResultCell } from './TreeCompare.props';
import { TreeGrid, TreeDataSource, GridColumn } from '../..';
import './TreeCompare.scss';

export class TreeCompare extends React.PureComponent<ITreeCompareProps, ITreeCompareState> {
    public constructor(props: ITreeCompareProps) {
        super(props);

        this.state = {
            dataSource: new TreeDataSource(props.rows),
            compareColumns: this.generateColumns(props.columns)
        };
    }

    public componentWillReceiveProps(newProps: ITreeCompareProps) {
        if (this.props.columns !== newProps.columns || this.props.rows !== newProps.rows) {
            this.setState({
                dataSource: new TreeDataSource(newProps.rows),
                compareColumns: this.generateColumns(newProps.columns)
            });
        }
    }

    generateColumns = (columns: Array<GridColumn>): Array<GridColumn> => {
        const { compareResultRenderer } = this.props;
        return columns.map((column, index) => {
            if (column.valueMember === 'compareResult') {
                return {
                    ...column,
                    cellFormatter: (cellData: ICompareResultCell, rowData: any) => compareResultRenderer(cellData)
                };
            }

            return column;
        });
    }

    public render() {
        return (
            <div className="tree-compare-container" >
                <TreeGrid
                    columns={this.state.compareColumns}
                    treeDataSource={this.state.dataSource}
                    isNodeSelectable={true}
                />
            </div>
        );
    }
}
