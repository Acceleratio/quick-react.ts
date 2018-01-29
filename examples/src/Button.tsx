/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from './../../src/components/Button/Button';
import './../../src/components/Icon/symbol-defs.svg';

export class Index extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <Button>Button</Button> <br /> <br />

                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button className={'button-primary'}>Primary Button</Button>
                    <Button className={'button-primary'} icon={'icon-add'}>Primary Button</Button>
                    <Button className={'button-primary'} icon={'icon-add'}></Button>
                </div>

                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button className={'button-primary-gray'}>Primary Gray Button</Button>
                    <Button className={'button-primary-gray'} icon={'icon-add'}>Primary Gray Button</Button>
                    <Button className={'button-primary-gray'} icon={'icon-add'}></Button>
                </div>

                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button className={'button-secondary'}>Secondary Button</Button>
                    <Button className={'button-secondary'} icon={'icon-add'}>Secondary Button</Button>
                    <Button className={'button-secondary'} icon={'icon-add'}></Button>
                </div>

                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button className={'button-secondary-blue'} >Secondary Blue Button</Button>
                    <Button className={'button-secondary-blue'} icon={'icon-add'}>Secondary Blue Button</Button>
                    <Button className={'button-secondary-blue'} icon={'icon-add'}></Button>
                </div>

                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button className={'button-tertiary'}>Tertiary Button</Button>
                    <Button className={'button-tertiary'} icon={'icon-add'}>Tertiary Button</Button>
                    <Button className={'button-tertiary'} icon={'icon-add'}></Button>
                </div>

                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button className={'button-textual'}>Textual Button</Button>
                    <Button className={'button-textual'} icon={'icon-add'}>Textual Button</Button>
                </div>

                <Button href={'javascript:void(0)'} target="_blank">Link</Button>
                <br /><br />
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button className={'button-primary'} isLoading={true}></Button>
                    <Button className={'button-primary-gray'} isLoading={true}></Button>
                    <Button className={'button-secondary'} isLoading={true}></Button>
                    <Button className={'button-secondary-blue'} isLoading={true}></Button>
                    <Button className={'button-tertiary'} isLoading={true}></Button>
                </div>
                <br /><br />
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button className={'button-succes'} icon="icon-checkmark">Succes</Button>
                    <Button className={'button-error'} icon="icon-error">Error</Button>
                </div>
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
