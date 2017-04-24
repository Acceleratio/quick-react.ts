import * as React from 'react';
import { Search } from './Search';

export interface ISearchProps extends React.Props<Search> {
    labelText?: string;
    onChange?: (newValue: any) => void;
    onSearch?: (newValue: any) => void;
    onChanged?: (newValue: any) => void;
    value?: string;
    className?: string;
    debounceWaitMs?: number;
}
