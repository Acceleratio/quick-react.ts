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
    style?: React.CSSProperties;
    iconTooltipContent?: string;
    onChange: (e: any) => void;
    onDoubleClick?: (e: any) => void;
}

export class VirtualizedTreeViewCheckBox extends React.PureComponent<IVirtualizedTreeViewCheckBoxProps, {}> {
    render() {
        const { itemId, checked, onChange, onDoubleClick, text, iconName, iconClassName, iconTooltipContent, style } = this.props;
        const isChecked = checked === CheckStatus.Checked;

        const virtualizedTreeClassName = classNames(
            'virtualized-tree-filter-checkbox',
            [this.props.className],
            {
                'partial-selected': checked === CheckStatus.ChildChecked
            }
        );

        return (
            <div className={virtualizedTreeClassName} onClick={onChange} onDoubleClick={onDoubleClick} style={style}>
                <input {...isChecked} className={'checkbox-input'} type="checkbox" />
                {isChecked && <Icon className={'virtualized-tree-filter-checkbox-checkmark'} iconName={'icon-checkmark'} />}
                <label className={classNames('virtualized-tree-filter-checkbox-label', { 'is-checked': isChecked })} >
                    <span className={'label'}>
                        <span title={iconTooltipContent}>
                            <Icon iconName={iconName} className={iconClassName} />
                        </span>
                        <span title={text}>{text}</span>
                    </span>
                </label>
            </div>
        );
    }
}

