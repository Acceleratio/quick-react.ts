import * as React from 'react';

export interface ITextFieldProps extends React.HTMLProps<HTMLInputElement | HTMLTextAreaElement> {
    multiline?: boolean;
    resizable?: boolean;
    underlined?: boolean;
    label?: string;
    description?: string;
    iconClass?: string;
    defaultValue?: string;
    value?: string;
    disabled?: boolean;
    onChanged?: (newValue: any) => void;
    onBeforeChange?: (newValue: any) => void;
    onNotifyValidationResult?: (errorMessage: string, value: string) => void;
    onGetErrorMessage?: (value: string) => string | PromiseLike<string>;
    onAccept?: () => void;
    deferredValidationTime?: number;
    className?: string;
    inputClassName?: string;
    /**
     * used to show a error after an async action
     * to hide the status, set to undefined or empty string
     * keep in mind that you don't have at the same time isSuccess = true and (errorMessage != undefined or errorMessage != '')
     */
    errorMessage?: string;
    /**
     * used to show a checkmark after an async action
     * to hide the status, set to undefined or false
     */
    isSuccess?: boolean;
}
