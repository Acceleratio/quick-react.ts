import * as React from 'react';

export interface IRenderFunction<P> {
  (props?: P, defaultRender?: (props?: P) => JSX.Element): JSX.Element;
}

export interface IDropdownProps {
  label ?: string;
  id ?: string;
  selectedKey ?: string | number;
  options ?: IDropdownOption[];
  onChanged ?: (option: IDropdownOption, index?: number) => void;
  onClick ?: (option: IDropdownOption, index?: number) => void;
  onRenderItem ?: IRenderFunction<IDropdownOption>;
  disabled ?: boolean;
  hasTitleBorder ?: boolean;
  icon ?: string;
  dropdownType ?: DropdownType;
  className ?: string;
  calloutClassName ?: string;
  layerClassName ?: string;
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
  customDropdown
}
