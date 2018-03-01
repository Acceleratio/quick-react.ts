import * as React from 'react';
import PropTypes from 'prop-types';
import { ILayerProps } from './Layer.Props';
import { LayerHost } from './LayerHost';
import { ProjectedLayer } from './ProjectedLayer';
import { getId } from '../../utilities/getId';
import './Layer.scss';

export class Layer extends React.Component<ILayerProps, {}> {
  public static contextTypes = {
    layerHost: PropTypes.object
  };

  public context: {
    layerHost: LayerHost;
  };

  private _rootElement: HTMLElement;
  private _projectedLayer: ProjectedLayer;
  private _layerHost: LayerHost;
  private _id: string;
  private _resolves: { [name: string]: (ref: any) => any };

  constructor(props?: ILayerProps) {
    super(props);

    this._id = getId();
  }

  public componentDidMount() {
    let layerHost = this.context.layerHost || LayerHost.getDefault(this._rootElement);

    this._layerHost = layerHost;

    layerHost.addLayer(this._id, this._rootElement, this.props, (projectedLayer) => {
      this._projectedLayer = projectedLayer;

      if (this.props.onLayerMounted) {
        this.props.onLayerMounted();
      }
    });
  }

  public componentWillUnmount() {
    this._layerHost.removeLayer(this._id);
  }

  public componentWillReceiveProps(newProps: ILayerProps) {
    if (this._projectedLayer) {
      this._projectedLayer.projectProps(newProps);
    }
  }

  public forceUpdate() {
    if (this._projectedLayer) {
      this._projectedLayer.forceUpdate();
    }
  }

  public render() {
    return (
      <span
        className="layer"
        ref={this.resolveRef('_rootElement')}
      />
    );
  }

  protected resolveRef(refName: string) {
    if (!this._resolves) {
      this._resolves = {};
    }
    if (!this._resolves[refName]) {
      this._resolves[refName] = (ref) => this[refName] = ref;
    }
    return this._resolves[refName];
  }

}
