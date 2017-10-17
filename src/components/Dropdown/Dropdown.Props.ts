import * as React from 'react';

export interface IRenderFunction<P> {
  (props?: P, defaultRender?: (props?: P) => JSX.Element): JSX.Element;
}

export interface IDropdownProps {
  label ?: string;
  id?: string;
  dropdownKey?: string | number;
  selectedKey ?: string | number;
  options ?: IDropdownOption[];
  onChanged ?: (option: IDropdownOption, index?: number) => void;
  onClick ?: (option: IDropdownOption, index?: number, dropdownKey?: string | number ) => void;
  onRenderItem ?: IRenderFunction<IDropdownOption>;
  disabled ?: boolean;
  hasTitleBorder ?: boolean;
  icon ?: string;
  dropdownType ?: DropdownType;
  className ?: string;
  calloutClassName ?: string;
  layerClassName ?: string;
  onClosed?: () => void;
  onMenuToggle?: (opened: boolean) => void;
  onCustomSelectionText?: () => string;
  displaySelection?: boolean; // default true
}

export interface IDropdownOption {
  key: string | number;
  text: string;
  index ?: number;
  selected ?: boolean;
  href ?: string;
  icon ?: string;
}

export enum DropdownType {
  selectionDropdown,
  linkDropdown,
  customDropdown,
  actionDropdown
}
