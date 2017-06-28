import * as React from 'react';
import { ICompactServerProps } from './CompactServer.Props';
import { TagContainer } from '../TagContainer/TagContainer';
import { Icon } from '../Icon/Icon';
import * as classNames from 'classnames';
import { autobind } from '../../utilities/autobind';
import { ServerStatus } from '../../models';
import { GetClassForStatus } from '../../utilities/server';
import './CompactServer.scss';

export class CompactServer extends React.PureComponent<ICompactServerProps, void> {
    public ContainerElement: HTMLElement;

    constructor(props?: ICompactServerProps) {
        super(props);
        this.ContainerElement = null;
    }



    render() {
        let { status } = this.props;
        let className = GetClassForStatus('compact-server-container', status);
        return (
            <div
                className={className}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                onClick={this.onclick}
                ref={(element) => this.ContainerElement = element}
            >
                <span className={'server-title'}>
                    <span>{this.props.name}</span>
                </span>
                {
                    this.props.roles.length > 0 &&
                    <div>
                        <hr />
                        <TagContainer title={''} tags={this.props.roles} />
                    </div>
                }
            </div>
        );
    }

    @autobind
    private onclick() {
        const { serverOnClick, id } = this.props;
        if (serverOnClick) {
            serverOnClick(id);
        }
    }

    @autobind
    private editRoles(event) {
        const { onRoleEdit } = this.props;
        onRoleEdit(this.props.id);
    }

    @autobind
    private closeServer(event) {
        const { onClose } = this.props;
        onClose(this.props.id);
    }
}
