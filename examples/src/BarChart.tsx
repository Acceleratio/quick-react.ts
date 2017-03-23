/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BarChart } from './../../src/components/BarChart/BarChart';
import { IBarChartData } from './../../src/components/BarChart/BarChart.props';
import { data, updatedData } from '..//mockData/barChart';

export class Index extends React.Component<any, any> {
     constructor() {
        super();
        this.state = { barChartData: data };
        setTimeout(() => this.setState({ barChartData: updatedData }), 2000);
    };
    public render() {
        return (
            <div>
                 <BarChart 
                     id={'bar-chart-1'} 
                     data={this.state.barChartData} 
                     dimensions={{width: '75%', height: '300px'}} 
                     onClick={data => console.log(data)} 
                     selectedIndex={4}/>
            </div>
        );
    };
};
ReactDOM.render(<Index />, document.getElementById('root'));
