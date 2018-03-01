import * as React from 'react';
import { EventGroup } from '../../../utilities/EventGroup';
import { KeyCodes } from '../../../utilities/KeyCodes';
import * as classNames from 'classnames';

const DIRECTIONAL_KEY_CODES = [
  KeyCodes.up,
  KeyCodes.down,
  KeyCodes.left,
  KeyCodes.right,
  KeyCodes.home,
  KeyCodes.end,
  KeyCodes.tab,
  KeyCodes.pageUp,
  KeyCodes.pageDown
];

export interface IFabricState {
  isFocusVisible?: boolean;
}
let _lastIsFocusVisible: boolean = false;

if (typeof (document) === 'object' && document.documentElement && !document.documentElement.getAttribute('dir')) {
  document.documentElement.setAttribute('dir', 'ltr');
}

export class Fabric extends React.Component<React.HTMLProps<HTMLDivElement>, IFabricState> {

  public refs: {
    [key: string]: React.ReactInstance;
    root: HTMLElement;
  };

  private _events: EventGroup;

  constructor(props) {
    super(props);

    this.state = {
      isFocusVisible: _lastIsFocusVisible
    };

    this._events = new EventGroup(this);
  }

  public componentDidMount() {
    this._events.on(document.body, 'mousedown', this._onMouseDown, true);
    this._events.on(document.body, 'keydown', this._onKeyDown, true);
  }

  public componentWillUnmount() {
    this._events.dispose();
  }

  public render() {
    const { isFocusVisible } = this.state;
    const rootClass = classNames('ms-Fabric ms-font-m', [this.props.className], {
      'is-focusVisible': isFocusVisible
    });

    return (
      <div {...this.props} className={rootClass} ref="root" />
    );
  }

  private _onMouseDown() {
    if (this.state.isFocusVisible) {
      this.setState({
        isFocusVisible: false
      });

      _lastIsFocusVisible = false;
    }
  }

  private _onKeyDown(ev: KeyboardEvent) {
    if (!this.state.isFocusVisible && DIRECTIONAL_KEY_CODES.indexOf(ev.which) > -1) {
      this.setState({
        isFocusVisible: true
      });

      _lastIsFocusVisible = true;
    }
  }
}
