/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { PieChart } from './../../src/components/PieChart/PieChart';
import { IPieChartData } from './../../src/components/PieChart/PieChart.props';
import { data, updatedData } from '../mockData/pieData';

export class Index extends React.Component<any, any> {
   constructor() {
        super();
        this.state = { pieChartData: data };
   }
    public render() {
        return (
            <div>
               <PieChart
                    id={'chart-1'}
                    dimensions={{ width: '25%', height: '100px' }}
                    data={this.state.pieChartData}
                    colors={['#344086', '#8bd764', '#f3f986', '#ec1271', '#636363', 'red', 'green', 'purple', 'aquamarine', 'lightgrey']}
                    tipText={(d: IPieChartData) => (d.label + ' : ' + d.value)} />
            </div>
        );
    };
};
ReactDOM.render(<Index />, document.getElementById('root'));
