/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { LeftNavigation } from './../../src/components/LeftNavigation/LeftNavigation';
import { ExpandCaptionsBehaviorEnum, LeftNavigationOptionPositionEnum, NotificationBubbleStyleObject, Tooltip, DirectionalHint } from '../../src/index';

const styleObject: NotificationBubbleStyleObject = { bubbleStyleObject: {backgroundColor: 'orange'}};

const options = [
    { text: 'Home page', id: 'Home', href: 'http://Acceleratio.net', icon: 'icon-help' },
    { text: 'Activity', id: 'Activity', href: '#1', disabled: true, icon: 'icon-account' },
    { text: 'News', id: 'News', href: '#2', icon: 'icon-add', notificationNumber: 15, notificationBubbleStyleObject: styleObject },
    { text: 'Documents library', id: 'Documents', href: '#3', selected: true, icon: 'icon-alert', notificationNumber: 7 },
    { text: 'Books', id: 'Books', href: '#4', icon: 'icon-trash', position: LeftNavigationOptionPositionEnum.Down }
];

export class Index extends React.Component<any, any> { 
    public render() {
        const defaultStyleObject: NotificationBubbleStyleObject = { bubbleStyleObject: {backgroundColor: 'purple'}};
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 1000 }}>
                <div style={{ height: 500, width: 200 }}>
                    <div style={{ padding: '20px 0' }}>Expand on hover</div>
                    <LeftNavigation
                        id={'leftNavigation'}
                        options={options}
                    />
                </div>
                <div style={{ height: 500, width: 200 }}>
                    <div style={{ padding: '20px 0' }}>Expand with menu</div>
                    <LeftNavigation
                        id={'leftNavigation'}
                        options={options}
                        expandCaptionsBehavior={ExpandCaptionsBehaviorEnum.ShowCaptionsOnToggleButton}
                        notificationBubbleStyleObject={defaultStyleObject}
                    />
                </div>
                <div style={{ height: 500, width: 200 }}>
                    <div style={{ padding: '20px 0' }}>No expand</div>
                    <LeftNavigation
                        id={'leftNavigation'}
                        options={options}
                        expandCaptionsBehavior={ExpandCaptionsBehaviorEnum.AlwaysHideCaptions}
                    />
                </div>

                <div style={{ height: 500, width: 200 }}>
                    <div style={{ padding: '20px 0' }}>Always expanded</div>
                    <LeftNavigation
                        id={'leftNavigation'}
                        options={options}
                        expandCaptionsBehavior={ExpandCaptionsBehaviorEnum.AlwaysShowCaptions}
                    />
                </div>
            </div>


        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
