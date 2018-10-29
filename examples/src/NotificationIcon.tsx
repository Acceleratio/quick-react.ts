/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { NotificationIcon, NotificationBubbleStyleObject } from '../../src/components/NotificationIcon';
import './../../src/components/Icon/symbol-defs.svg';
import { IconSize } from '../../src/components/Icon';

export class Index extends React.Component<any, any> {
    public render () {
        const styleElement = document.querySelector('style').innerText;
        const ficons = styleElement.match(/icon-([\s\S]*?)(?=:before)/gm);

        let symbols = Array.from(document.querySelector('defs').children);
        const iconSVGName = symbols[0].id.substring(symbols[0].id.indexOf('_') + 1);
        const iconFiconsName = ficons[0];
        let styleObject: NotificationBubbleStyleObject = { bubbleStyleObject: {backgroundColor: 'blue'}};
        return (
            <div>              
                <div> <NotificationIcon iconName={iconFiconsName} notificationNumber={0}></NotificationIcon> <span>   {iconFiconsName}</span></div>
                <div> <NotificationIcon iconName={iconFiconsName} notificationNumber={9}></NotificationIcon> <span>   {iconFiconsName}</span></div>
                <div> <NotificationIcon iconName={iconFiconsName} notificationNumber={19}></NotificationIcon> <span>   {iconFiconsName}</span></div>
                <div> <NotificationIcon iconName={iconFiconsName} notificationNumber={119}></NotificationIcon> <span>   {iconFiconsName}</span></div>
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={0}></NotificationIcon> <span>   {iconSVGName}</span></div>
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={9}></NotificationIcon> <span>   {iconSVGName}</span></div>
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={19}></NotificationIcon> <span>   {iconSVGName}</span></div>
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={119}></NotificationIcon> <span>   {iconSVGName}</span></div>
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={9} iconSize={IconSize.smallest}></NotificationIcon> <span>   {iconSVGName}</span></div>
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={19} iconSize={IconSize.smallest}></NotificationIcon> <span>   {iconSVGName}</span></div> 
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={119} iconSize={IconSize.smallest}></NotificationIcon> <span>   {iconSVGName}</span></div> 
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={9} iconSize={IconSize.small}></NotificationIcon> <span>   {iconSVGName}</span></div>
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={19} iconSize={IconSize.small}></NotificationIcon> <span>   {iconSVGName}</span></div>  
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={119} iconSize={IconSize.small}></NotificationIcon> <span>   {iconSVGName}</span></div>  
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={9} iconSize={IconSize.medium}></NotificationIcon> <span>   {iconSVGName}</span></div>
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={19} iconSize={IconSize.medium}></NotificationIcon> <span>   {iconSVGName}</span></div>    
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={119} iconSize={IconSize.medium}></NotificationIcon> <span>   {iconSVGName}</span></div>    
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={9} iconSize={IconSize.large}></NotificationIcon> <span>   {iconSVGName}</span></div>
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={19} iconSize={IconSize.large}></NotificationIcon> <span>   {iconSVGName}</span></div>
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={119} iconSize={IconSize.large}></NotificationIcon> <span>   {iconSVGName}</span></div>
                <div> <NotificationIcon iconName={iconSVGName} notificationNumber={9} iconSize={IconSize.large} notificationBubbleStyleObject={styleObject}></NotificationIcon> <span>   {iconSVGName}</span></div>
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
