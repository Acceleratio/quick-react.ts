import * as React from 'react';
import * as classNames from 'classnames';
import { IIconProps, IconSize } from './Icon.Props';
import { getNativeAttributes, htmlElementAttributes } from '../../utilities/attributes';

import './Icon.scss';

export const Icon: (props: IIconProps) => JSX.Element = (props: IIconProps) => {
    const customIcon = props.iconName === '';
    const svgIcon = props.iconName && props.iconName.startsWith('svg');
    let iconPrefix = 'icon '.concat(svgIcon ? 'svg' : 'font');
    let iconClassName = classNames(
        [iconPrefix], {
            [props.iconName]: !customIcon
        }, [props.className]);

    let iconHeight: any;
    let iconWidth: any;
    
    switch (props.iconSize) {
        case IconSize.smallest:
            iconHeight = '16px';
            iconWidth = '16px';
            break;
        case IconSize.small:
            iconHeight = '24px';
            iconWidth = '24px';
            break;
        case IconSize.medium:
            iconHeight = '32px';
            iconWidth = '32px';
            break;
        case IconSize.large:
            iconHeight = '64px';
            iconWidth = '64px';
            break;
        default:
        iconHeight = props.height || '16px';
        iconWidth = props.width || '16px';
    }

    if (svgIcon) {
        return <svg className={iconClassName} width={iconWidth} height={iconHeight}>
            <use xlinkHref={'#symbol-defs_' + props.iconName} />
        </svg>;
    } else {
        return <i { ...getNativeAttributes(props, htmlElementAttributes) } className={iconClassName} />;
    }
};
