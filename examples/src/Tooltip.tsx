/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Tooltip } from './../../src/components/Tooltip/Tooltip';
import { Button } from './../../src/components/Button/Button';
import { DirectionalHint } from './../../src/utilities/DirectionalHint';
import { Icon } from '../../src/components/Icon/Icon';

export class Index extends React.Component<any, any> {
    public render() {
        return (
            <div style={{ display: 'inline-flex' }}>
                <Tooltip content={'This is tooltip! This is tooltip! This is tooltip!\r\nOne more tooltip row! Something to explain'} title={'Tooltip title'} >
                    <Button>Hover Over Me</Button>
                </Tooltip>
                <div style={{ marginLeft: '50px' }}>
                    <Tooltip content={'This is tooltip'} className={'tooltip-white'} directionalHint={DirectionalHint.rightCenter}>
                        <Button>Hover Over Me</Button>
                    </Tooltip>
                </div>
                <div style={{ marginLeft: '50px' }}>
                    <Tooltip content={'This tooltip\r\ndisplay new line!'} directionalHint={DirectionalHint.rightCenter} >
                        <Button>Hover Over Me</Button>
                    </Tooltip>
                </div>

                <div style={{ marginLeft: '50px' }}>
                    <Tooltip content={'This is error tooltip'} className={'tooltip-error'} directionalHint={DirectionalHint.rightCenter} >
                        <Button>Hover Over Me</Button>
                    </Tooltip>
                </div>
                <div style={{ marginLeft: '50px' }}>
                    <Tooltip content={'This is error tooltip, because an error occured'} title={'Error tooltip title'}className={'tooltip-error'} directionalHint={DirectionalHint.rightCenter} >
                        <Button>Hover Over Me</Button>
                    </Tooltip>
                </div>

            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
