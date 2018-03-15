/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Icon } from './../../src/components/Icon/Icon';
import './../../src/components/Icon/symbol-defs.svg';

export class Index extends React.Component<any, any> {
    public render () {
        const styleElement = document.querySelector('style').innerText;
        const ficons = styleElement.match(/icon-([\s\S]*?)(?=:before)/gm);

        let symbols = Array.from(document.querySelector('defs').children);
        return (
            <div>
                {ficons.map(i => {
                    return <div> <Icon iconName={i}></Icon> <span>   {i}</span></div>;
                })}
                {symbols.map(i => {
                    let iconName = i.id.substring(i.id.indexOf('_') + 1);
                    return <div> <Icon iconName={iconName}></Icon> <span>   {iconName}</span></div>;
                })}
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
