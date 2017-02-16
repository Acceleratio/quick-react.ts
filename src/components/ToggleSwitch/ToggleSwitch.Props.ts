import * as React from 'react';

export interface IToggleSwitchProps {
    checked ?: boolean;
    className?: string;
    onChange?: (checked?: boolean) => void;
}
