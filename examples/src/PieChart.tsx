/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Label } from '../../src/components/Label/Label';

import { PieChart } from '../../src/components/PieChart/PieChart';
import { IPieChartData } from '../../src/components/PieChart/PieChart.props';
import { pieData, pieUpdatedData } from '../../src/MockData/pieData';

export class Index extends React.PureComponent<any, any> {
   constructor() {
        super();
    }
    public render() {

        const divStyle = {
            width: '50%',
            height: '200px',
            border: '1px solid lightgrey',
            textAlign: 'center'
        };

        const labelStyle = {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        }

        return (
            <div>
                <div style={ divStyle }>
                    <Label style={ labelStyle }>Pie chart component</Label>
                    <PieChart
                            id={'chart-1'}
                            dimensions={{ width: '100%', height: 'calc(100% - 40px)' }}
                            data={pieUpdatedData}
                            colors={['#344086', '#8bd764', '#f3f986', '#ec1271', '#636363', 'red', 'green', 'purple', 'aquamarine', 'lightgrey']}
                            tipText={(d: IPieChartData) => (d.label + ' : ' + d.value)} 
                            showLegend={true}
                            displayingElements={4}/>
                </div>
            </div>
        );
    };
};

ReactDOM.render(<Index />, document.getElementById('root'));
