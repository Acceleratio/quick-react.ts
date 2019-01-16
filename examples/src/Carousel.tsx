/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Carousel, CarouselProps, CarouselStepProps } from './../../src/components/Carousel';

export class Index extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    private _steps: Array<CarouselStepProps> = [
        {header: 'Test Header 1', stepContent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'},
        {header: 'Test Header 2', stepContent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'},
        {header: 'Test Header 3', stepContent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'}
    ];

    render() {
        return <div style={{width: 320}}>
            <Carousel steps={this._steps} onFinish={() => console.log('finished')} />
        </div>;
    }
}

ReactDOM.render(<Index />, document.getElementById('root'));
