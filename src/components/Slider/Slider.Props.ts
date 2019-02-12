import * as React from 'react';

export interface ISliderProps {
    label?: string;
    defaultValue?: number;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    onChange?: (value: number) => void;
    disabled?: boolean;
    className?: string;
    buttonProps?: React.HTMLProps<HTMLButtonElement>;
    showTickMarks?: boolean;
}

export interface ISlider {
    value: number;
    focus: () => void;
}
