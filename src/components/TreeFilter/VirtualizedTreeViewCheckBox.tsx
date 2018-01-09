import * as React from 'react';
import { CheckStatus } from './TreeFilter.Props';
import { Icon } from '../Icon';
import * as classNames from 'classnames';

import './VirtualizedTreeViewCheckBox.scss';

export interface IVirtualizedTreeViewCheckBoxProps {
    itemId: string;
    checked: CheckStatus;
    text: string;
    className?: string;
    iconName?: string;
    iconClassName?: string;
    onChange?(): void;
}

export class VirtualizedTreeViewCheckBox extends React.PureComponent<IVirtualizedTreeViewCheckBoxProps, {}> {

    render() {
        const { itemId, checked, onChange, text, iconName, iconClassName } = this.props;
        const isChecked = checked === CheckStatus.Checked;

        const virtualizedTreeClassName = classNames(
            'virtualized-tree-filter-checkbox',
            [this.props.className],
            {
                'partial-selected': checked === CheckStatus.ChildChecked
            }
        );

        return (
            <div className={virtualizedTreeClassName} onClick={onChange} >
                <input {...isChecked} className={'checkbox-input'} type="checkbox" />
                {isChecked && <Icon className={'virtualized-tree-filter-checkbox-checkmark'} iconName={'icon-checkmark'} />}
                <label className={classNames('virtualized-tree-filter-checkbox-label', { 'is-checked': isChecked })} >
                    <span className={'label'} title={text}>
                        {iconName && 
                            <Icon iconName={iconName} className={iconClassName} />
                        }                       
                        {text}
                    </span>
                </label>
            </div>
        );
    }
}
