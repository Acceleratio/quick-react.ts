import * as React from 'react';
import * as classNames from 'classnames';
import { Details } from '../Details/Details';
import { Label } from '../Label/Label';
import { IServerDetailsProps } from './ServerDetails.Props';
import { Icon } from '../Icon/Icon';
import './ServerDetails.scss';

import { IServerCountersData } from './ServerDetails.Props';
export class ServerDetails extends React.PureComponent<IServerDetailsProps, any> {

    constructor(props?: IServerDetailsProps) {
        super(props);
    }

    public render() {
        const name = this._checkNameLen(this.props.serverName);

        return (
            <div className={classNames('server-details', this.props.serverStatusClass)}>
                <div className={'server-details-header'}>
                    <Label className="server-name" title={this.props.fqdmServerName}>{name}</Label>
                    <Icon 
                        className={classNames('disk-icon')} 
                        iconName={'icon-LoadWithErrors'} 
                        title={'Disks\n'}/>
                    { this.props.numberOfUsers && 
                        <Icon data-users={this.props.numberOfUsers}
                            iconName={'icon-User'}
                            title={this.props.numberOfUsers + ' number of users online'}/>
                    }
                    {this.props.hasCloseButton && 
                        <Icon disabled={ false }
                            className={'dialog-button dialog-button-close'}
                            onClick={this._dismiss.bind(this)} 
                            iconName={'icon-Delete'}/>
                    }
                    <hr/>
                </div>
                {this.props.children}
                <div className={'counters-container'}>
                    {this._createCountersTiles(this.props.countersData)}
                </div>
            </div>
        );
    }

    private _dismiss() {
        this.props.onDismiss(this.props.serverId);
    }

    private _checkNameLen(name: string) : string {
        if (name.length > 15) {
            if (name.indexOf('.') !== -1 && name.indexOf('.') < 16) {
                name = name.substr(0, name.indexOf('.') + 1);
            } else {
                name = name.substr(0, 16) + '...';
            }                
        }
        return name;
    }
    
    private _createCountersTiles(data: Array<IServerCountersData>) : Array<JSX.Element> {
        return data.map(
            (d: IServerCountersData) => 
                <div className={'tile'} title={this._createTooltipText(d.totalUsage)}>
                    <p>{d.title}</p>
                    <Label className={d.status}>{d.currentUsage}</Label>
                    <Label className={d.status}>{d.usageUnit}</Label>
                </div>
        );
    }

    private _createTooltipText(arr: Array<string>) : string {
        let data = '';
        for (let i = 0; i < arr.length; i++) {
            data += arr[i] + '\n';
        }
        return data;
    }
}
