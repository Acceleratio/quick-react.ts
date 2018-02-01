/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MessageBox } from './../../src/components/MessageBox/MessageBox';
import { MessageLevel } from './../../src/components/MessageBox/MessageBox.Props';
import { Button } from './../../src/components/Button/Button';
import { autobind } from './../../src/utilities/autobind';

const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus suscipit semper justo nec mattis. In euismod molestie libero vel lacinia. Etiam vitae velit lobortis, pretium est quis, pulvinar elit. In ac bibendum magna. Nam et leo feugiat nisi porta sodales. Integer rhoncus augue eu purus eleifend sodales. Fusce id sapien.';
const mediumText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar, enim sit amet laoreet euismod, elit metus porta lectus, sed ultrices nibh ligula id tortor.';
const shortText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie laoreet ligula.';
const shortestText = 'Lorem ipsum dolor sit amet.';

export class Index extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            isLoading: true,
            errorMessage: ''
        };

        setTimeout(() => {
            this.setState({ isLoading: false, errorMessage: mediumText });
        }, 6000);
    }

    @autobind
    private _changeState(isOpen) {
        this.setState({ isOpen });
    }

    public render() {
        return (
            <div>
                <Button onClick={() => this._changeState(true)}>Open MessageBox</Button>
                <MessageBox
                    title="Message box!"
                    message={longText}
                    onDismiss={() => this._changeState(false)}
                    isOpen={this.state.isOpen}
                    buttons={[{ title: 'Button1', className: 'button-primary-gray' }]}
                    onAccept={() => console.log('Accept')}
                    onClose={() => console.log('On close')}
                    isLoading={this.state.isLoading}
                    errorMessage={this.state.errorMessage}
                    iconStyle={{fontSize: '32px'}}
                    // bulletedList={['SpFarm', 'SpFarm 2013', 'SpFarm 2016']}
                />
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
