import { nullFunc } from '../../utilities/common';

export interface ICellElementProps {
    id: any;
    style?: any;
    className?: string;
    title?: string;
    rowClass?: string;
    rowData?: any;
    rowIndex?: any;
    onMouseEnter?: any;
    onMouseLeave?: any;
    onClick?: any;
    onClickParameter?: {};
    onRowDoubleClicked?: any;
    element?: JSX.Element | Array<JSX.Element>;
}

export const defaultProps = {
    onMouseEnter: nullFunc,
    onMouseLeave: nullFunc,
    onClick: nullFunc,
    onRowDoubleClicked: nullFunc,
    isSelectable: false
};
