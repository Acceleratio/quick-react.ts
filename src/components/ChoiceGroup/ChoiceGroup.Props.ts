import * as React from 'react';

export interface IChoiceGroupProps extends React.HTMLProps<HTMLElement> {
    options: IChoiceGroupOption[];
    onChanged?: (option: IChoiceGroupOption, evt?: React.FormEvent<HTMLElement>) => void;
    label?: string;
}

export interface IChoiceGroupOption {
    key: string;
    text: string;
    checked?: boolean;
    isChecked?: boolean;
    disabled?: boolean;
    isDisabled?: boolean;
    additionalContent?: JSX.Element;
}
