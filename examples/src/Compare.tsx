import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'babel-polyfill';
import 'ts-helpers';
import Resizable from 'react-resizable-box';
import { Dropdown, DropdownType } from '../../src/components/Dropdown';
import { Button } from '../../src/components/Button';
import { QuickGrid, IQuickGridProps, SortDirection, GridColumn, QuickGridActions } from '../../src/components/QuickGrid';
import { CompareComponent } from './../../src/components/Compare/CompareComponent';
import { CompareDifferenceType } from './../../src/components/Compare/CompareComponent.Props';
import * as MockData from '../MockData/CompareData';
export class Index extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    public render() {
        return (
            <div style={{ 'height': '750', 'width': '100%' }}>
                <CompareComponent
                    sourceRows={MockData.sourceRows}
                    targetRows={MockData.targetRows}
                    columns={MockData.columns}
                    differences={MockData.difference}
                />
            </div>
        );
    }

}
ReactDOM.render(<Index />, document.getElementById('root'));
