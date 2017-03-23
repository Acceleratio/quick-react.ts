/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { LineChart } from '../../src/components/LineChart/LineChart';
import { data, series } from '../MockData/Data';

export class Index extends React.PureComponent<any, any> {
    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <div>
                <LineChart
                    title={'Acceleratio responsive line chart'}
                    id={'line-chart-1'} 
                    dimensions={{ width: '100%', height: '300px' }}
                    xAxisFormat={() => '%d.%m.%y'}
                    series={series}
                    yAxisFormat={(d) => d + '%'}
                    colorPallette={['#344086', '#8bd764', '#f3f986', '#ec1271', '#636363', 'red', 'green', 'purple', 'aquamarine', 'lightgrey']}
                />
            </div>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById('root'));
