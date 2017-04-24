import * as React from 'react';
import {EventGroup} from './EventGroup';
import {IDisposable} from './IDisposable';
import {Async} from './Async';

export class CommonComponent < P, S > extends React.PureComponent < P, S > {

    private __async: Async;
    private __events: EventGroup;
    private __disposables: IDisposable[];
    private __resolves: { [ name: string ]: (ref: any) => any };

    protected get _async(): Async {
        if (!this.__async) {
        this.__async = new Async(this);
        this._disposables.push(this.__async);
        }

        return this.__async;
    }

    protected get _events(): EventGroup {
        if (!this.__events) {
            this.__events = new EventGroup(this);
            this._disposables.push(this.__events);
        }
        return this.__events;
    }
    protected get _disposables(): IDisposable[]{
        if (!this.__disposables) {
            this.__disposables = [];
        }
        return this.__disposables;
    }
    protected _resolveRef(refName: string) {
    if (!this.__resolves) {
      this.__resolves = {};
    }
    if (!this.__resolves[refName]) {
      this.__resolves[refName] = (ref) => this[refName] = ref;
    }
    return this.__resolves[refName];
  }
}
