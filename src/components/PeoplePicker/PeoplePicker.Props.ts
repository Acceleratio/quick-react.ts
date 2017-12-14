import * as React from 'react';
import { PeoplePicker } from './PeoplePicker';
import { IPrincipal } from './Principal.Props';

export interface IPeoplePickerProps extends React.Props<PeoplePicker> {
    className?: string;
    disabled?: boolean;
    errorMessage?: string;
    iconName?: string;
    labelText?: string;
    loadingSuggestionList?: boolean;
    onSearch?: (searchedValue: string) => void;
    onSelect?: (selectedPersonList: IPrincipal[]) => void;
    placeholder?: string;
    singleSelect?: boolean;
    suggestionList?: IPrincipal[]; 
}
