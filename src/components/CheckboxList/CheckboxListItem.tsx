import * as React from 'react';
import * as classNames from 'classnames';
import { ICheckboxListItemProps, ICheckboxListItem } from './CheckboxListItem.Props';
import { Icon } from '../../components/Icon/Icon';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { CommonComponent } from '../Common/Common';
import { autobind } from '../../utilities/autobind';
import './CheckboxList.scss';

export class CheckboxListItem extends CommonComponent<ICheckboxListItemProps, any> {
    public static defaultProps: ICheckboxListItem = {
        isOpen: false
    };

    constructor(props) {
        super(props);

        this.state = { isOpen: props.isOpen, iconArrow: 'icon-arrow_right' };
    }

    public shouldComponentUpdate(nextProps, nextState) {
        return !(this.props.item === nextProps.item
            // && this.props.onChange === nextProps.onChange
            && this.state.isOpen === nextState.isOpen
            && this.state.iconArrow === nextState.iconArrow
        );
    }

    public render(): JSX.Element {
        let { item, onChange } = this.props;
        let { isOpen } = this.state;

        const itemClassName = classNames(
            'checkboxlist-child',
            {
                'expanded': this.state.isOpen,
                'collapsed': !this.state.isOpen
            }
        );
        let isParent = item.children && item.children.length > 0;
        return (
            <div>
                {
                    isParent && <div className={'checkboxlist-item'} onClick={this._onItemClick.bind(this)}>
                        <Icon iconName={this.state.iconArrow}></Icon>
                        {item.text}
                    </div>
                }
                {
                    !isParent && <Checkbox tooltip={item.tooltip} checked={item.checked !== undefined ? item.checked : false} label={item.text} onChange={onChange} itemId={item.id}></Checkbox>
                }

                <div className={itemClassName}>
                    {item.children && item.children.map((child, index) => (
                        <div key={index}>
                            <Checkbox tooltip={child.tooltip} checked={child.checked !== undefined ? child.checked : false} label={child.text} onChange={onChange} itemId={child.id}></Checkbox>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    @autobind
    private _onItemClick(ev: MouseEvent) {
        let { isOpen } = this.state;

        this.setState({
            isOpen: !isOpen,
            iconArrow: isOpen ? 'icon-arrow_right' : 'icon-arrow_down_right'
        });

        ev.stopPropagation();
        ev.preventDefault();
    }
}
