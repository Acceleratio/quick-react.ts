import * as React from 'react';
import {IconSize} from '../Icon/Icon.Props';

export interface INotificationIconProps extends React.HTMLProps<HTMLElement> {
  iconName?: string;
  className?: string;
  iconSize?: IconSize;
  width?: any;
  height?: any;
  containerClassName?: string;
  notificationNumber?: number;
  notificationBubbleStyleObject?: NotificationBubbleStyleObject;
  notificationBubbleClassName?: string;
  notificationNumberClassName?: string;
}

export interface NotificationBubbleStyleObject {
  containerStyleObject?: ContainerStyleObject;
  bubbleStyleObject?: BubbleStyleObject;
  numberStyleObject?: NumberStyleObject;
}

export interface ContainerStyleObject {
  position?: string;
  display?: string;
  marginRight?: string;
  marginTop?: string;
}

export interface BubbleStyleObject {
  position?: string;
  top?: string;
  right?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  backgroundColor?: string;
  transform?: string;
}

export interface NumberStyleObject {
  lineHeight?: string;
  fontWeight?: string;
  fontSize?: string;
  marginLeft?: string;
  marginRight?: string;
  color?: string;
}

export const DefaultIconNumberStyleObject = (iconSize: IconSize, numberOfCharacters: number) => {
  let styleObject : NotificationBubbleStyleObject = { 
  containerStyleObject: {
    position: 'relative',
    display: 'inline-flex'},
  bubbleStyleObject: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    borderRadius: '50%',
    backgroundColor: '#FB6464',
    transform: 'translate(50%,-50%)'
  },
  numberStyleObject: {
    fontWeight: 'bold',
    marginRight: '3px',
    color: 'white'}
  };
   
    switch (iconSize) {
    case IconSize.smallest:
        styleObject.containerStyleObject.marginRight = '7px';
        styleObject.containerStyleObject.marginTop = '7px';
        styleObject.bubbleStyleObject.height = '14px';
        styleObject.bubbleStyleObject.width = '14px';
        styleObject.numberStyleObject.fontSize = '10px';
        styleObject.numberStyleObject.lineHeight = '14px';
        styleObject.numberStyleObject.marginLeft = '4px';
        break;
    case IconSize.small:
      styleObject.containerStyleObject.marginRight = '8px';
      styleObject.containerStyleObject.marginTop = '8px';
        styleObject.bubbleStyleObject.height = '16px';
        styleObject.bubbleStyleObject.width = '16px';
        styleObject.numberStyleObject.fontSize = '12px';
        styleObject.numberStyleObject.lineHeight = '16px';
        styleObject.numberStyleObject.marginLeft = '4px';
        break;
    case IconSize.medium:
        styleObject.containerStyleObject.marginRight = '9px';
        styleObject.containerStyleObject.marginTop = '9px';
        styleObject.bubbleStyleObject.height = '18px';
        styleObject.bubbleStyleObject.width = '18px';
        styleObject.numberStyleObject.fontSize = '14px';
        styleObject.numberStyleObject.lineHeight = '18px';
        styleObject.numberStyleObject.marginLeft = '5px';
        break;
    case IconSize.large:
        styleObject.containerStyleObject.marginRight = '11px';
        styleObject.containerStyleObject.marginTop = '11px';
        styleObject.bubbleStyleObject.height = '22px';
        styleObject.bubbleStyleObject.width = '22px';
        styleObject.numberStyleObject.fontSize = '18px';
        styleObject.numberStyleObject.lineHeight = '22px';
        styleObject.numberStyleObject.marginLeft = '6px';
        break;
    default:
    styleObject.containerStyleObject.marginRight = '7px';
    styleObject.containerStyleObject.marginTop = '7px';
    styleObject.bubbleStyleObject.height = '14px';
    styleObject.bubbleStyleObject.width = '14px';
    styleObject.numberStyleObject.fontSize = '10px';
    styleObject.numberStyleObject.lineHeight = '14px';
    styleObject.numberStyleObject.marginLeft = '4px';
}


  if (numberOfCharacters === 2) {
    styleObject.bubbleStyleObject.borderRadius = '40px';
      switch (iconSize) {
      case IconSize.smallest:
          styleObject.containerStyleObject.marginRight = '10px';
          styleObject.bubbleStyleObject.width = '20px';
          break;
      case IconSize.small:
          styleObject.containerStyleObject.marginRight = '11px';
          styleObject.bubbleStyleObject.width = '22px';
          break;
      case IconSize.medium:
          styleObject.containerStyleObject.marginRight = '12.5px';
          styleObject.bubbleStyleObject.width = '25px';          
          break;
      case IconSize.large:
          styleObject.containerStyleObject.marginRight = '16px';
          styleObject.bubbleStyleObject.width = '32px';
          break;
      default:
      styleObject.containerStyleObject.marginRight = '10px';
      styleObject.bubbleStyleObject.width = '20px';
    }
  }

  if (numberOfCharacters === 3) {
    styleObject.bubbleStyleObject.borderRadius = '40px';
      switch (iconSize) {
      case IconSize.smallest:
          styleObject.containerStyleObject.marginRight = '13px';
          styleObject.bubbleStyleObject.width = '26px';
          break;
      case IconSize.small:
          styleObject.containerStyleObject.marginRight = '14px';
          styleObject.bubbleStyleObject.width = '28px';
          break;
      case IconSize.medium:
          styleObject.containerStyleObject.marginRight = '16px';
          styleObject.bubbleStyleObject.width = '32px';          
          break;
      case IconSize.large:
          styleObject.containerStyleObject.marginRight = '21px';
          styleObject.bubbleStyleObject.width = '42px';
          break;
      default:
      styleObject.containerStyleObject.marginRight = '13px';
      styleObject.bubbleStyleObject.width = '26px';
    }
  }

  return styleObject;
};

