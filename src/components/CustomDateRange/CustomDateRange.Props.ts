import { IDateValidationState } from './CustomDateRange';

export interface IDateValidation {
    isValidated: boolean;
    validationErrorMessage: string;
}

export type DateValidator = (selectedStartDate: Date, selectedEndDate: Date) => IDateValidation;

export interface ICustomDateRangeProps {
    isDialogOpen: boolean;
    startDate: Date;
    endDate: Date;
    className?: string;
    invalidDateRangeSelected?: boolean;
    validationFunctions?: Array<DateValidator>;
    onDateSelectionChanged?: (selectedStartDate: Date, selectedEndDate: Date) => void;
    onSave?: (startDate: Date, endDate: Date) => void;
    onClose?: () => void;
}

export interface ICustomDateRangeState {
    startDate?: Date;
    endDate?: Date;
    dateRangeValidation: IDateValidationState;
}
