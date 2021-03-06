import * as React from 'react';
import * as classNames from 'classnames';
import { IPivotProps } from './Pivot.Props';
import { IPivotItemProps, RenderModeEnum } from './PivotItem.Props';
import { KeyCodes } from '../../utilities/KeyCodes';
import { PivotItem } from './PivotItem';
import { PivotLinkFormat } from './Pivot.Props';
import { getId } from '../../utilities/getId';
import { autobind } from '../../utilities/autobind';
import { Icon } from '../Icon/Icon';
import './Pivot.scss';

export interface IPivotState {
    links: IPivotItemProps[];
    selectedKey: string;
    id: string;
}

export class Pivot extends React.Component<IPivotProps, IPivotState> {
    private _keyToIndexMapping: { [key: string]: number };

    constructor(props: IPivotProps) {
        super(props);

        const links: IPivotItemProps[] = this._getPivotLinks(this.props);
        let selectedKey: string;

        if (props.selectedKey) {
            selectedKey = props.selectedKey;
        } else if (props.selectedIndex !== undefined) {
            selectedKey = links[props.selectedIndex].itemKey;
        } else {
            selectedKey = links[0].itemKey;
        }

        this.state = {
            links,
            selectedKey,
            id: getId('pivot')
        } as IPivotState;

        this._renderLink = this._renderLink.bind(this);
    }

    public componentWillReceiveProps(nextProps: IPivotProps) {
        const links: IPivotItemProps[] = this._getPivotLinks(nextProps);
        let selectedKey: string;
        if (nextProps.selectedKey && this._isKeyValid(nextProps.selectedKey)) {
            selectedKey = nextProps.selectedKey;
        } else if (nextProps.selectedIndex && nextProps.selectedIndex < links.length) {
            selectedKey = links[nextProps.selectedIndex].itemKey;
        } else if (this._isKeyValid(this.state.selectedKey)) {
            selectedKey = this.state.selectedKey;
        } else {
            selectedKey = links[0].itemKey;
        }
        this.setState({
            links,
            selectedKey
        } as IPivotState);
    }

    public render() {
        return (
            <div className={this.props.className}>
                {this._renderPivotLinks()}
                {this._renderPivotItem()}
            </div>
        );
    }

    private _renderPivotLinks() {
        const className = classNames(
            'pivot',
            [this.props.className],
            {
                'pivot-tabs': this.props.linkFormat === PivotLinkFormat.tabs
            },
            {
                'pivot-minimal-tabs': this.props.linkFormat === PivotLinkFormat.minimalTabs
            },
            {
                'pivot-minimal-tabs no-border': this.props.linkFormat === PivotLinkFormat.minimalTabsNoBorders
            }
        );

        return (
            <ul className={className}
                role="tablist">
                {this.state.links.map((link) => this._renderLink(link))}
            </ul>
        );
    }

    private _renderLink(link: IPivotItemProps) {
        const { itemKey, itemCount, linkClassname } = link;
        const { id } = this.state;
        let countText;
        if (itemCount !== undefined && this.props.linkFormat !== PivotLinkFormat.tabs) {
            countText = <span className={'pivot-count'}>({itemCount})</span>;
        }
        const pivotLinkClassName = classNames(
            'pivot-link',
            linkClassname,
            {
                'is-selected': this.state.selectedKey === itemKey
            }
        );
        return (
            <a
                id={id + '-tab'}
                key={itemKey}
                className={classNames(pivotLinkClassName, { 'is-disabled': link.disabled })}
                onClick={this._onLinkClick.bind(this, itemKey)}
                role="tab">
                {this._linkRenderer(link)}
                {countText}
            </a>
        );
    }

    private _linkRenderer(link: IPivotItemProps): JSX.Element {
        const { textSize } = this.props;
        let textStyle;
        if (textSize) {
            textStyle = {fontSize: textSize};
        }
        const textElement = <span className={'pivot-text'} style={textStyle}>{link.linkText}</span>;
        const iconElement = <Icon iconName={link.linkIcon} className={'pivot-icon'} title={link.linkText} />;

        switch (link.linkRenderMode) {
            case RenderModeEnum.Text:
            return textElement;
            case RenderModeEnum.Icon:
            return iconElement;
            case RenderModeEnum.Both:
            return <div className="pivot-icon-text">{iconElement}{textElement}</div>;
            default:
            if (link.linkIcon) {
                return iconElement;
            } else {
                return textElement;
            }            
        }
    }

    private _renderPivotItem() {
        const itemKey: string = this.state.selectedKey;
        const index = this._keyToIndexMapping[itemKey];
        let { id } = this.state;

        const className = classNames(
            'pivotItem',
            {
                'pivot-minimal-tabs': this.props.linkFormat === PivotLinkFormat.minimalTabs
            },
            {
                'pivot-minimal-tabs no-border': this.props.linkFormat === PivotLinkFormat.minimalTabsNoBorders
            }
        );

        return (
            <div className={className}
                role="tabpanel"
                id={id + '-panel'}>
                {React.Children.toArray(this.props.children)[index]}
            </div>
        );
    }

    private _getPivotLinks(props: IPivotProps): IPivotItemProps[] {
        const links: IPivotItemProps[] = [];
        this._keyToIndexMapping = {};

        // Mapping each PivotItem object into links variable
        // React.Children(children, function)
        React.Children.map(props.children, (child: any, index: number) => {
            if (typeof child === 'object' && child.type === PivotItem) {
                const pivotItem = child as PivotItem;
                const itemKey = pivotItem.props.itemKey || index.toString();

                links.push({
                    linkText: pivotItem.props.linkText,
                    linkIcon: pivotItem.props.linkIcon,
                    itemKey: itemKey,
                    itemCount: pivotItem.props.itemCount,
                    disabled: pivotItem.props.disabled,
                    linkRenderMode: pivotItem.props.linkRenderMode,
                    linkClassname: pivotItem.props.linkClassname
                });
                this._keyToIndexMapping[itemKey] = index;
            }
        });

        return links;
    }

    private _isKeyValid(itemKey: string) {
        return itemKey !== undefined && this._keyToIndexMapping[itemKey] !== undefined;
    }

    /**
    * Handles the onClick event on PivotLinks
    */
    private _onLinkClick(itemKey: string, ev: React.MouseEvent<any>) {
        ev.preventDefault();
        this._updateSelectedItem(itemKey, ev);
    }

    /**
     * Updates the state with the new selected index
     */
    private _updateSelectedItem(itemKey: string, ev?: React.MouseEvent<any>) {
        this.setState({
            selectedKey: itemKey
        } as IPivotState, () => {
            if (this.props.onLinkClick && this._keyToIndexMapping[itemKey] >= 0) {
                const index = this._keyToIndexMapping[itemKey];
                // React.Element<any> cannot directly convert to PivotItem.
                const item = React.Children.toArray(this.props.children)[index] as any;

                if (typeof item === 'object' && item.type === PivotItem) {
                    this.props.onLinkClick(item as PivotItem, ev);
                }
            }
        });
    }
}
