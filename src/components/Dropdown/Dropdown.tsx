import * as React from 'react';
import { IDropdownProps, IDropdownOption, DropdownType } from './Dropdown.Props';
import { DirectionalHint } from '../../utilities/DirectionalHint';
import { Callout } from '../Callout/Callout';
import { Icon } from '../Icon/Icon';
import {KeyCodes} from '../../utilities/KeyCodes';
import { autobind } from '../../utilities/autobind';
import * as classNames from 'classnames';
import {findIndex} from '../../utilities/array';
import {getId} from '../../utilities/getId';
import './Dropdown.scss';

export interface IDropdownState {
  isOpen: boolean;
  selectedIndex: number;
  isDisabled: boolean;
};

export class Dropdown extends React.Component<IDropdownProps, any> {

  public static defaultProps = {
    options: [],
    hasTitleBorder: false,
    dropdownType: DropdownType.linkDropdown
  };

  private static Option: string = 'option';

  public refs: {
    [key: string]: React.ReactInstance,
    root: HTMLElement
  };

  private _optionList: HTMLElement;
  private _dropDown: HTMLDivElement;
  private _dropdownLabel: HTMLElement;

  constructor(props?: IDropdownProps) {
    super(props, {
      'isDisabled': 'disabled'
    });

    this.state = {
      id: getId('Dropdown'),
      isOpen: false,
      selectedIndex: this._getSelectedIndex(props.options, props.selectedKey)
    };
  }

  public componentWillReceiveProps(newProps: IDropdownProps) {
    this.setState({
      selectedIndex: this._getSelectedIndex(newProps.options, newProps.selectedKey)
    });
  }

  public render() {
    let { label, options, onRenderItem = this._onRenderItem, hasTitleBorder, icon, dropdownType, children, className, calloutClassName, layerClassName } = this.props;
    let { id, isOpen, selectedIndex, isDisabled } = this.state;
    let selectedOption = options[selectedIndex];

    const dropdownTitleClassName = classNames(
      {
        'dropdown-title-border': this.props.hasTitleBorder,
        'dropdown-title': !this.props.hasTitleBorder
      }
    );

    const dropdownIconClassName = classNames(
      {
        'iconArrowWithBorder': this.props.hasTitleBorder,
        'iconArrow': !this.props.hasTitleBorder
      }
    );

    return (
      <div ref="root">
        { label && (
          <label id={ id + '-label' } className="label" ref={ (dropdownLabel) => this._dropdownLabel = dropdownLabel } >{ label }</label>
        ) }
        <div
          data-is-focusable={ true }
          ref={ (c): HTMLElement => this._dropDown = c }
          id={ id }
          className={ classNames('dropdown', className, {
            'is-open': isOpen, 'is-disabled': isDisabled
          }) }
          tabIndex={ isDisabled ? -1 : 0 }
          onKeyDown={ this._onDropdownKeyDown }
          onClick={ this._onDropdownClick }
          role="combobox"
          >
          <span className={dropdownTitleClassName}>
            { icon && (
              <Icon iconName={icon}></Icon>
            ) }
            { dropdownType === DropdownType.selectionDropdown ?
              selectedOption ? onRenderItem(selectedOption, this._onRenderItem) : ''
            : null }
          </span>   
          <Icon className={dropdownIconClassName} iconName={'icon-ArrowDown'}></Icon>
        </div>
        { isOpen && (
          <Callout
            isBeakVisible={ false }
            className={ classNames('dropdown-callout', calloutClassName, layerClassName )}
            gapSpace={ 0 }
            doNotLayer={ false }
            targetElement={ this._dropDown }
            directionalHint={ DirectionalHint.bottomLeftEdge }
            onDismiss={ this._onDismiss }
            >
            { dropdownType === DropdownType.customDropdown ? (
              <ul ref={ (c: HTMLElement) => this._optionList = c }
                id={ id + '-list' }
                className="dropdown-items"
                role="listbox">
                  { children }  
              </ul>
            ) : (
              <ul ref={ (c: HTMLElement) => this._optionList = c }
                id={ id + '-list' }
                style={ { width: this._dropDown.clientWidth - 2 } }
                className="dropdown-items"
                role="listbox">
                  { options && options.map((option, index) => (
                    <li id={ id + '-list' + index.toString() }
                      ref={ Dropdown.Option + index.toString() }
                      key={ option.key }
                      data-index={ index }
                      data-is-focusable={ true }
                      className={ classNames('dropdown-item', { 'is-selected': selectedIndex === index }) }
                      onClick={ () => this._onItemClick(index) }
                      onFocus={ () => this.setSelectedIndex(index) }
                      role="option">
                        { option.icon ? <Icon iconName={option.icon}></Icon>
                        : null }
                        { option.text }
                    </li>
                  )) }
              </ul>
            )}
          </Callout>
        ) }
      </div>
    );
  }

  public focus() {
    if (this._dropDown && this._dropDown.tabIndex !== -1) {
      this._dropDown.focus();
    }
  }

  public setSelectedIndex(index: number) {
    let { onChanged, options, onClick } = this.props;
    let { selectedIndex } = this.state;

    index = Math.max(0, Math.min(options.length - 1, index));

    if (index !== selectedIndex) {
      this.setState({
        selectedIndex: index
      });

      if (onChanged) {
        onChanged(options[index], index);
      }
    } 
    if (onClick) {
      onClick(options[index], index);
    }
  
  }

  @autobind
  private _onRenderItem(item: IDropdownOption): JSX.Element {
    return <span>{ item.text }</span>;
  }

  private _onItemClick(index) {
    this.setSelectedIndex(index);
    this.setState({
      isOpen: false
    });
  }

  @autobind
  private _onDismiss() {
    this.setState({ isOpen: false });
  }

  private _getSelectedIndex(options: IDropdownOption[], selectedKey: string | number) {
    return findIndex(options, (option => (option.isSelected || option.selected || (selectedKey != null) && option.key === selectedKey)));
  }

  @autobind
  private _onDropdownKeyDown(ev: React.KeyboardEvent<any>) {
    switch (ev.which) {
      case KeyCodes.enter:
        this.setState({
          isOpen: !this.state.isOpen
        });
        break;

      case KeyCodes.escape:
        this.setState({
          isOpen: false
        });
        break;

      case KeyCodes.up:
        this.setSelectedIndex(this.state.selectedIndex - 1);
        break;

      case KeyCodes.down:
        this.setSelectedIndex(this.state.selectedIndex + 1);
        break;

      case KeyCodes.home:
        this.setSelectedIndex(0);
        break;

      case KeyCodes.end:
        this.setSelectedIndex(this.props.options.length - 1);
        break;

      default:
        return;
    }

    ev.stopPropagation();
    ev.preventDefault();
  }

  @autobind
  private _onDropdownClick() {
    let { isDisabled, isOpen } = this.state;

    if (!isDisabled) {
      this.setState({
        isOpen: !isOpen
      });
    }
  }
}
