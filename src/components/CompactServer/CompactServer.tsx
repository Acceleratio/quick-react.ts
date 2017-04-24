import * as React from 'react';
import { ICompactServerProps } from './CompactServer.Props';
import { TagContainer } from '../TagContainer/TagContainer';
import { Icon } from '../Icon/Icon';
import * as classNames from 'classnames';
import { autobind } from '../../utilities/autobind';
import { ServerStatus } from '../../models';
import './CompactServer.scss';

export class CompactServer extends React.PureComponent<ICompactServerProps, any> {
    constructor(props?: ICompactServerProps) {
        super(props);
    }
    
    render() {
        let { status } = this.props;
        let className = classNames({ 'compact-server-container': true },
            { 'status-warning': status === ServerStatus.Warning },
            { 'status-ok': status === ServerStatus.OK },
            { 'status-critical': status === ServerStatus.Critical });

        return (
            <div
            className={className}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave} 
            onClick={this.onclick}
            >
                <span className={'server-title'}>
                    <span>{this.props.name}</span>                    
                </span>
                {
                    this.props.roles.length > 0 &&
                    <div>
                        <hr />
                        <TagContainer title={''} tags={this.props.roles}>
                        </TagContainer>
                    </div>
                }
            </div>
        );
    }

    @autobind
    private onclick() {
        const {serverOnClick, id} = this.props;
        if (serverOnClick) {
            serverOnClick(id);
        }
    }

    @autobind
    private editRoles(event) {
        const {onRoleEdit} = this.props;
        onRoleEdit(this.props.id);
    }

    @autobind
    private closeServer(event) {
        const {onClose} = this.props;
        onClose(this.props.id);
    }
}
