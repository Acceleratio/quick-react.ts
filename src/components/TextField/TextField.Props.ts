import * as React from 'react';

export interface ITextFieldProps extends React.HTMLProps<HTMLInputElement | HTMLTextAreaElement> {
    multiline ?: boolean;
    resizable ?: boolean;
    underlined ?: boolean;
    label ?: string;
    description ?: string;
    iconClass ?: string;
    defaultValue ?: string;
    value ?: string;
    disabled ?: boolean;
    errorMessage ?: string;
    onChanged ?: (newValue: any) => void;
    onBeforeChange ?: (newValue: any) => void;
    onNotifyValidationResult ?: (errorMessage: string, value: string) => void;
    onGetErrorMessage ?: (value: string) => string | PromiseLike<string>;
    onAccept ?: () => void;
    deferredValidationTime ?: number;
    className ?: string;
    inputClassName ?: string;
}