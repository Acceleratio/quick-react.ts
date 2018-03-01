/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BarChart } from './../../src/components/BarChart/BarChart';
import { IBarChartData } from './../../src/components/BarChart/BarChart.props';
import { barData, barUpdatedData } from '../MockData/barChart';

export class Index extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = { barChartData: barData };
    }
    public render() {
        return (
            <div>
                <BarChart
                    id={'bar-chart-1'}
                    data={this.state.barChartData}
                    dimensions={{ width: '75%', height: '300px' }}
                    onClick={data => console.log(data)}
                    selectedIndex={4} />
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
