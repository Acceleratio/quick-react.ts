import * as React from 'react';
import { Callout } from './Callout';
import { CalloutContent } from './CalloutContent';
import { DirectionalHint } from '../../utilities/DirectionalHint';
import { IRectangle } from '../../utilities/IRectangle';
import { IPoint } from '../../utilities/IPoint';

export interface ICalloutProps extends React.Props<Callout | CalloutContent> {
  
  target?: HTMLElement | string | MouseEvent;
  targetElement?: HTMLElement;
  directionalHint?: DirectionalHint;
  gapSpace?: number;
  beakWidth?: number;
  bounds?: IRectangle;
  useTargetPoint?: boolean;
  targetPoint?: IPoint;
  isBeakVisible?: boolean;
  coverTarget?: boolean;
  className?: string;
  onLayerMounted?: () => void;
  onDismiss?: (ev?: any) => void;
  doNotLayer?: boolean;
  setInitialFocus?: boolean;
  layerClassName?: string;
}
