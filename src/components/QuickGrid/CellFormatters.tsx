import { BoolFormatTypeEnum } from './QuickGrid.Props';
import { Icon } from '../Icon/Icon';
import React = require('react');

export function boolFormatterFactory(type: BoolFormatTypeEnum): (cellData: any, rowData: any) => any {
    switch (type) {
        case BoolFormatTypeEnum.CheckmarkOnly:
            return (cellData: any, rowData: any) => {
                return <div className="grid-component-cell-inner" >
                    <Icon className="center-icon" iconName={ cellData ? 'svg-icon-checkmark' : null}/>
                </div>;
            };
        case BoolFormatTypeEnum.CheckmarkAndCross:
            return (cellData: any, rowData: any) => {
                return <div className="grid-component-cell-inner" >
                    <Icon className="center-icon" iconName={ cellData ? 'svg-icon-checkmark' : 'svg-icon-delete'}/>
                </div>;
            };
        case BoolFormatTypeEnum.TextOnly:
        default:
            return (cellData: any, rowData: any) => {
                return <div className="grid-component-cell-inner" >
                    {cellData ? 'True' : 'False'}
                </div>;
            };
    }
}
