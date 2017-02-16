import * as React from 'react';
import { ICalloutProps } from './Callout.Props';
import { ICalloutState, CalloutContent } from './CalloutContent';
import { Layer } from '../Layers';

export class Callout extends React.Component<ICalloutProps, ICalloutState> {

  constructor(props: ICalloutProps) {
    super(props);
  }

  public render() {
    let content = (
      <CalloutContent { ...this.props }/>
    );
    return this.props.doNotLayer ? content : (
      <Layer className={ this.props.layerClassName }>
        { content }
      </Layer>
    );
  }
}
