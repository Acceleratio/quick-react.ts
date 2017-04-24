import * as React from 'react';
import { IDashboardHeaderProps } from './DashboardHeader.Props';
import { Search } from '../Search/Search';
import { Pivot } from '../Pivot/Pivot';
import { PivotItem } from '../Pivot/PivotItem';
import { autobind } from '../../utilities/autobind';
import { Label } from '../Label/Label';
import { Icon } from '../Icon/Icon';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import './DashboardHeader.scss';

export class DashboardHeader extends React.PureComponent<IDashboardHeaderProps, any> {
    public render() {
        let { hasAddFarmButton, title, selectedDashboardKey } = this.props;
        return (
            <div className="dashboard-header-container">
                <span className={classNames('dashboard-header-title-container', this.props.headerClass)}>
                    <span className={'dashboard-header-title'} title={title}>{title}</span>
                    {
                        hasAddFarmButton &&
                        <Icon className={'add-farm'} iconName={'icon-add'} onClick={this.props.onAddFarmClick} title={'Add'} />
                    }
                </span>
                <Search onSearch={this.props.onSearch} onChange={this.props.onChanged} />
                <div style={{ display: 'inline-block' }}>&nbsp;</div>

                {this.props.pivotItems &&
                    <Pivot onLinkClick={this.props.onViewChange} selectedKey={selectedDashboardKey.toString()}>{
                        Object.keys(this.props.pivotItems).map(key => (
                            <PivotItem
                                key={key}
                                linkText={this.props.pivotItems[key].linkText}
                                linkIcon={this.props.pivotItems[key].linkIcon}
                                itemKey={key}
                                itemCount={this.props.pivotItems[key].itemCount} />
                        ))
                    }

                    </Pivot>
                }
            </div>
        );
    }
}
