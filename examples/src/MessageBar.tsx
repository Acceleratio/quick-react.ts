/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MessageBar } from './../../src/components/MessageBar/MessageBar';
import { MessageBarType } from './../../src/components/MessageBar/MessageBar.Props';

export class Index extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            dontShowAgainChecked: false
        };
    }

    public render() {
        return (
            <div>
                <MessageBar 
                    messageBarType={MessageBarType.warning} 
                    hasDontShowAgain={true} 
                    dontShowAgainChecked={this.state.dontShowAgainChecked}
                    dontShowAgainClicked={() => this.setState({ dontShowAgainChecked : !this.state.dontShowAgainChecked })}
                    onDismiss={() => { console.log('test'); } }
                >This is warning messageBar!</MessageBar>

                {/* <MessageBar 
                    messageBarType={MessageBarType.success} 
                    hasDontShowAgain={true} 
                    dontShowAgainChecked={this.state.dontShowAgainChecked}
                    dontShowAgainClicked={() => this.setState({ dontShowAgainChecked : !this.state.dontShowAgainChecked })}
                    onDismiss={() => { console.log('test'); } }
                >This is success messageBar!</MessageBar>

                <MessageBar 
                    messageBarType={MessageBarType.error} 
                    hasDontShowAgain={true} 
                    dontShowAgainChecked={this.state.dontShowAgainChecked}
                    dontShowAgainClicked={() => this.setState({ dontShowAgainChecked : !this.state.dontShowAgainChecked })}
                    onDismiss={() => { console.log('test'); } }
                >This is error messageBar!</MessageBar>

                <MessageBar 
                    messageBarType={MessageBarType.info} 
                    hasDontShowAgain={false}
                    onDismiss={() => { console.log('test'); } }
                >This is info messageBar!</MessageBar> */}
             </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
