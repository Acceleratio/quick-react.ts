import * as React from 'react';

export interface IIconProps extends React.HTMLProps<HTMLElement> {
  iconName?: string;
  className?: string;
  iconSize?: IconSize;
  width?: any;
  height?: any;
}

export enum IconSize {
  smallest = 'smallest',
  small = 'small',
  medium = 'medium',
  large = 'large'
}
