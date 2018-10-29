import * as React from 'react';
import { INotificationIconProps, DefaultIconNumberStyleObject, NotificationBubbleStyleObject} from './NotificationIcon.Props';
import { Icon } from '../Icon/Icon';
import * as classNames from 'classnames';
import './NotificationIcon.scss';

export const NotificationIcon: (props: INotificationIconProps) => JSX.Element = (props: INotificationIconProps) => {

    let iconClassName = classNames(
        'icon-with-notification',
        [props.className]);

    const numberString = props.notificationNumber === undefined || props.notificationNumber === 0 ? '' 
                            : props.notificationNumber < 100 ? props.notificationNumber.toLocaleString() : '99+';

    const defaultStyleObject = DefaultIconNumberStyleObject(props.iconSize, numberString.length);
   
    let styleObject: NotificationBubbleStyleObject = { ...defaultStyleObject};

    if (props.notificationBubbleStyleObject) {
        if (props.notificationBubbleStyleObject.containerStyleObject) {
            Object.assign(styleObject.containerStyleObject, props.notificationBubbleStyleObject.containerStyleObject);
        }
        if (props.notificationBubbleStyleObject.bubbleStyleObject) {
            Object.assign(styleObject.bubbleStyleObject, props.notificationBubbleStyleObject.bubbleStyleObject);
        }
        if (props.notificationBubbleStyleObject.numberStyleObject) {
            Object.assign(styleObject.numberStyleObject, props.notificationBubbleStyleObject.numberStyleObject);
        }
    }

    return (
    <div style={styleObject.containerStyleObject as React.CSSProperties} className={props.containerClassName}>
        <Icon iconName={props.iconName} className={iconClassName} iconSize={props.iconSize}
                width={props.width} height={props.height}></Icon>
        {(numberString !== '') &&
            <div style={styleObject.bubbleStyleObject as React.CSSProperties} className={props.notificationBubbleClassName}>
                <div style={styleObject.numberStyleObject as React.CSSProperties} className={props.notificationNumberClassName}>
                    {numberString}
                </div>
            </div>
        }
    </div>
    );
};
