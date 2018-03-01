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

export interface ILayer {
  id: string;
  parentElement: HTMLElement;
  props: ILayerProps;
  onMounted: (projectedLayer: ProjectedLayer) => void;
}

const DEFAULT_HOST_ID = '__layerHost';

export class LayerHost extends React.Component<ILayerHostProps, {}> {
  public static contextTypes = {
    layerHost: PropTypes.object
  };

  private _layers: ILayer[];
  private _layerRefs: {
    [key: string]: ProjectedLayer
  };

  public static getDefault(layerElement: HTMLElement): LayerHost {
    let doc = layerElement.ownerDocument;
    let hostElement = doc.getElementById(DEFAULT_HOST_ID);

    if (hostElement) {
      return hostElement[DEFAULT_HOST_ID] as LayerHost;
    } else {
      hostElement = doc.createElement('div');
      hostElement.id = DEFAULT_HOST_ID;
      doc.body.appendChild(hostElement);

      let defaultHost = ReactDOM.render(<LayerHost />, hostElement) as LayerHost;

      hostElement[DEFAULT_HOST_ID] = defaultHost;

      return defaultHost;
    }
  }

  constructor(props: ILayerHostProps) {
    super(props);

    this.state = {
      layers: []
    };

    this._layers = [];
    this._layerRefs = {};
  }

  public getChildContext() {
    return {
      layerHost: this as LayerHost
    };
  }

  public render() {
    let divProps = getNativeAttributes(this.props, divAttributes);

    return (
      <div {...divProps} className={classNames('layer-host', [this.props.className])}>
        <Fabric>
          {this.props.children}
          <div className="overlay">
            {this._layers.map(layer => (
              <ProjectedLayer
                key={layer.id}
                layerId={layer.id}
                parentElement={layer.parentElement}
                defaultRemoteProps={layer.props}
                ref={this._resolveLayer}
              />
            ))}
          </div>
        </Fabric>
      </div>
    );
  }

  public addLayer(id: string, parentElement: HTMLElement, props: ILayerProps, onMounted: (proxyLayer: ProjectedLayer) => void) {
    this._layers.push({
      id,
      parentElement,
      props,
      onMounted
    });
    this.forceUpdate();
  }

  public removeLayer(id: string) {
    let index = findIndex(this._layers, layer => layer.id === id);

    if (index >= 0) {
      this._layers.splice(index, 1);
      delete this._layerRefs[id];
      this.forceUpdate();
    }
  }

  @autobind
  private _resolveLayer(projectedLayer: ProjectedLayer) {
    if (projectedLayer) {
      let layerId = projectedLayer.getId();
      let index = findIndex(this._layers, layer => layer.id === layerId);

      if (index >= 0 && this._layerRefs[layerId] !== projectedLayer) {
        this._layerRefs[layerId] = projectedLayer;
        this._layers[index].onMounted(projectedLayer);
      }
    }
  }

}
