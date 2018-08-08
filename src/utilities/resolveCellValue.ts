import { GridColumn } from '../components/QuickGrid';

export let resolveCellValue = (rowData: any, cell: GridColumn) => {
    return cell.getCellValue !== undefined ?
        cell.getCellValue(rowData) : rowData[cell.valueMember];
};
