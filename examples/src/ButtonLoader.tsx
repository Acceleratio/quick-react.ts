/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from '../../src/components/Button/Button';


export class Index extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false
        };
    }

    public componentDidMount() {
        setInterval(this._changeLoading.bind(this), 5000);        
        
    }


    private _actionCounter = 0;
    private _changeLoading() {
        this.setState({ isLoading: !this.state.isLoading, isSuccess: Math.random() < 0.5 });
        setTimeout(() => {
            this.setState({ isSuccess: undefined });       
        }, 2000);
    }

    private _changeSucces() {
        this.setState({ isSuccess: !this.state.isSucces, isLoading: false });
    }

    public render() {
        return (
            <div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button
                        className="button-primary"
                        onClick={() => this._onClick()}
                        isLoading={this.state.isLoading}
                        isSuccess={this.state.isSuccess}>Button Loader Primary</Button>
                </div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button
                        className="button-primary-gray"
                        onClick={() => this._onClick()}
                        isLoading={this.state.isLoading}
                        isSuccess={this.state.isSuccess}>Button Loader Primary Grey</Button>
                </div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button
                        className="button-secondary"
                        onClick={() => this._onClick()}
                        isLoading={this.state.isLoading}
                        isSuccess={this.state.isSuccess}>Button Loader Secondary</Button>
                </div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button
                        className="button-secondary-blue"
                        onClick={() => this._onClick()}
                        isLoading={false}
                        isSuccess={true}>Button Loader Secondary Blue</Button>
                </div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <Button
                        className="button-tertiary"
                        onClick={() => this._onClick()}
                        isLoading={this.state.isLoading}
                        isSuccess={this.state.isSuccess}>Button Loader Secondary Blue</Button>
                </div>
            </div>
        );
    }

    private _onClick() {
        console.log('click');
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
