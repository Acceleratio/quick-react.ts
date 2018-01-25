/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ButtonLoader } from './../../src/components/ButtonLoader/ButtonLoader';


export class Index extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            isSucces: false,
            isError: false
        };
    }

    public componentDidMount() {
        setInterval(this._changeLoading.bind(this), 3000);
        setInterval(this._changeSucces.bind(this), 5000);
        setInterval(this._changeError.bind(this), 8000);
    }

    private _changeLoading() {
        this.setState({ isLoading: !this.state.isLoading, isSucces: false, isError: false });
    }

    private _changeSucces() {
        this.setState({ isSucces: !this.state.isSucces, isLoading: false, isError: false });
    }

    private _changeError() {
        this.setState({ isError: !this.state.isError, isSucces: false, isLoading: false });
    }

    public render() {
        return (
            <div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <ButtonLoader
                        className="button-primary"
                        buttonText="Button Loader Primary"
                        onClick={() => this._onClick()}
                        isLoading={this.state.isLoading}
                        isSucces={this.state.isSucces}
                        isError={this.state.isError}
                    />
                </div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <ButtonLoader
                        className="button-primary-gray"
                        buttonText="Button Loader Primary Grey"
                        onClick={() => this._onClick()}
                        isLoading={this.state.isLoading}
                        isSucces={this.state.isSucces}
                        isError={this.state.isError}
                    />
                </div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <ButtonLoader
                        className="button-secondary"
                        buttonText="Button Loader Secondary"
                        onClick={() => this._onClick()}
                        isLoading={this.state.isLoading}
                        isSucces={this.state.isSucces}
                        isError={this.state.isError}
                    />
                </div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <ButtonLoader
                        className="button-secondary-blue"
                        buttonText="Button Loader Secondary Blue"
                        onClick={() => this._onClick()}
                        isLoading={this.state.isLoading}
                        isSucces={this.state.isSucces}
                        isError={this.state.isError}
                    />
                </div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <ButtonLoader
                        className="button-tertiary"
                        buttonText="Button Tertiary"
                        onClick={() => this._onClick()}
                        isLoading={this.state.isLoading}
                        isSucces={this.state.isSucces}
                        isError={this.state.isError}
                    />
                </div>
            </div>
        );
    }

    private _onClick() {
        console.log('click');
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
