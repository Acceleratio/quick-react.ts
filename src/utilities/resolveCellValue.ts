import { GridColumn } from '../components/QuickGrid';

export let resolveCellValue = (rowData: any, cell: GridColumn) => {
    const value = cell.getCellValue !== undefined ? 
        cell.getCellValue(rowData) : rowData[cell.valueMember];
    if (typeof value === 'string') {
        return value.toLowerCase();
    }
    return value;
};

export let resolveCellValueForDisplay = (rowData: any, cell: GridColumn) => {
    return cell.getCellValue !== undefined ?
        cell.getCellValue(rowData) : rowData[cell.dataMember || cell.valueMember];
};
