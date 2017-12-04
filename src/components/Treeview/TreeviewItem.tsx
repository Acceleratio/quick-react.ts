import * as React from 'react';
import * as classNames from 'classnames';
import { ITreeviewItemProps, ITreeviewItem } from './TreeviewItem.Props';
import { Icon } from '../../components/Icon/Icon';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { CommonComponent } from '../Common/Common';
import { autobind } from '../../utilities/autobind';
import { Treeview } from './Treeview';
import './Treeview.scss';
import { TreeviewItemHoverBtn } from './treeviewItemHoverBtn';

const expandedIcon: string = 'icon-arrow_down_right';
const collapsedIcon: string = 'icon-arrow_right';

export class TreeviewItem extends CommonComponent<ITreeviewItemProps, any> {
    public static defaultProps: ITreeviewItem = {
        isOpen: false
    };

    private onExpandCore: (itemId?: string, expanded?: boolean) => void;
    private getIsOpen: () => boolean;

    public constructor(props: ITreeviewItemProps) {
        super(props);

        const isItemOpened = props.item.isOpen;
        let isOpenInitially;

        if (props.onExpand === undefined) {
            isOpenInitially = isItemOpened !== undefined ? isItemOpened : false;
        } else {
            isOpenInitially = undefined;
        }

        this.state = {
            hover: false,
            isOpen: isOpenInitially
        };
    }

    public render(): JSX.Element {
        let { item, onChange, showCheckbox, children, recursive, onExpand } = this.props;
        let checkedStatus = this._getChildrenChecked(item, item.checked, recursive);
        let checked = checkedStatus.isChecked;
        this.onExpandCore = onExpand !== undefined ? onExpand : this._changeInternalIsOpenState;
        const isOpen = this._getIsOpen();
        const arrowIcon = isOpen ? expandedIcon : collapsedIcon;
        const itemClassName = isOpen ? 'expanded' : 'collapsed';
        const parentItemClassName = item.children.length > 0 ? 'treeveiw-parent-item' : '';
        const treeveiwItemClassName = 'treeveiw-content';
        const selectedClassName = (recursive && checkedStatus.hasCheckedChild && !checked) ? 'partial-selected' : '';

        return (
            <div onMouseEnter={this._onItemHover} onMouseLeave={this._onItemLeaveHover} className={parentItemClassName}>
                <div className={classNames('treeview-item', item.className)}>
                    {
                        item.children.length > 0 &&
                        <Icon iconName={arrowIcon} className="arrow-icon" onClick={this._onExpand}></Icon>
                    }
                    <div className={treeveiwItemClassName} >
                        {
                            showCheckbox &&
                            <Checkbox
                                label={item.text}
                                onChange={this._onItemSelect}
                                checked={checked}
                                className={selectedClassName}
                                iconClassName={item.iconClassName}
                            />
                        }
                        {
                            !showCheckbox &&
                            <span
                                onClick={this.onItemClick}
                                title={item.title}
                            >
                                {item.iconClassName &&
                                    <Icon
                                        iconName={item.iconClassName} />}
                                {item.text}
                            </span>
                        }
                        {
                            this.props.item.hoverOverBtn && this.state.hover &&
                            <div className="treeview-item__icons-container">
                                {
                                    this.props.item.hoverOverBtn.map((btn, key) => (
                                        <TreeviewItemHoverBtn
                                            key={key}
                                            id={this.props.item.id}
                                            iconName={btn.iconName}
                                            onClick={btn.callback}
                                            className="treeview-item__icon"
                                        />
                                    ))
                                }
                            </div>
                        }
                    </div>
                </div>
                {
                    item.children.length > 0 && isOpen &&
                    <div className={itemClassName}>
                        {
                            item.children.map((child, index) =>
                                <TreeviewItem
                                    item={child}
                                    onChange={onChange}
                                    key={index}
                                    showCheckbox={showCheckbox}
                                    children={child.children}
                                    recursive={recursive}
                                    className={child.className}
                                    onExpand={onExpand}
                                />
                            )
                        }
                    </div>
                }
            </div>
        );
    }

    private _changeInternalIsOpenState() {
        let { isOpen } = this.state;
        this.setState({
            isOpen: !isOpen
        });
    }

    private _getIsOpen() {
        if (this.props.onExpand === undefined) {
            return this.state.isOpen;
        } else {
            return this.props.item.isOpen !== undefined ? this.props.item.isOpen : false;
        }
    }

    @autobind
    private _onItemHover() {
        this.setState({
            hover: true
        });
    }

    @autobind
    private _onItemLeaveHover() {
        this.setState({
            hover: false
        });
    }

    onItemClick = (event: any) => {
        this._onItemSelect(event, '', true);
    }

    @autobind
    private _onItemSelect(event: any, itemId: string, checked: boolean): void {
        const { item } = this.props;
        if (this.props.showCheckbox) {
            let items = [];
            items.push(item.id);
            if (this.props.recursive) {
                items = items.concat(this._getChildrenId(this.props.children));
            }
            this.props.onChange(event, items, checked);
        } else {
            this.props.onChange(event, [item.id], checked);
        }
    }

    @autobind
    private _onExpand(ev: any) {
        const { item } = this.props;

        ev.stopPropagation();
        ev.preventDefault();

        this.onExpandCore(item.id, !item.isOpen);
    }

    @autobind
    private _getChildrenId(children) {
        let result = [];
        children.forEach((item) => {
            result.push(item.id);
            if (item.children.length > 0) {
                result = result.concat(this._getChildrenId(item.children));
            }
        });
        return result;
    }

    @autobind
    private _getChildrenChecked(item: ITreeviewItem, checked: boolean, recursive: boolean) {
        let result = { isChecked: true, hasCheckedChild: false };
        if (item.children.length === 0 || !recursive) {
            result.isChecked = checked === undefined ? false : checked;
        } else {
            item.children.forEach((element) => {
                if (element.checked) {
                    result.hasCheckedChild = true;
                }
                let childStatus = this._getChildrenChecked(element, element.checked, recursive);
                result.isChecked = result.isChecked && childStatus.isChecked;
                if (childStatus.hasCheckedChild) {
                    result.hasCheckedChild = true;
                }
            });
        }
        return result;
    }
}
