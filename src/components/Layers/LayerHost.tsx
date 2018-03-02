import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import { Fabric } from './Fabric/Fabric';
import { autobind } from '../../utilities/autobind';
import { findIndex } from '../../utilities/array';
import { divAttributes, getNativeAttributes } from '../../utilities/attributes';

import * as classNames from 'classnames';
import { ProjectedLayer } from './ProjectedLayer';
import { ILayerProps } from './Layer.Props';
import { ILayerHostProps } from './LayerHost.Props';
import { Layer } from '.';
import { CommonComponent } from '../Common';

export interface ILayer {
  id: string;
  parentElement: HTMLElement;
  props: ILayerProps;
  onMounted: (projectedLayer: ProjectedLayer) => void;
}

const DEFAULT_HOST_ID = '__layerHost';

export class LayerHost extends CommonComponent<React.HTMLProps<HTMLElement>, {}> {

  public shouldComponentUpdate() {
    return false;
  }

  public componentDidMount() {
    Layer.notifyHostChanged(this.props.id);
  }

  public componentWillUnmount() {
    Layer.notifyHostChanged(this.props.id);
  }

  public render() {
    return (
      <div {...this.props} className="ms-LayerHost" />
    );
  }
}
