import * as React from 'react';
import * as classNames from 'classnames';
import { IIconProps } from './Icon.Props';
import { getNativeAttributes, htmlElementAttributes } from '../../utilities/attributes';

import './Icon.scss';

export const Icon: (props: IIconProps) => JSX.Element = (props: IIconProps) => {
    const customIcon = props.iconName === '';
    const svgIcon = props.iconName.startsWith('svg');
    let iconPrefix = 'icon '.concat( svgIcon ? 'svg' : 'font');
    let iconClassName = classNames(
        [iconPrefix], {
            [props.iconName]: !customIcon
        }, [props.className]);

        if (svgIcon) {
            return <svg className = {iconClassName} width = {props.width} height= {props.height}>
            <use xlinkHref= {'#symbol-defs_' + props.iconName} />
        </svg>;
        }else {
            return <i { ...getNativeAttributes(props, htmlElementAttributes) } className={iconClassName} />;
        }

    

};
