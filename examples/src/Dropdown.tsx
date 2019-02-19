/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Dropdown } from './../../src/components/Dropdown/Dropdown';
import { DropdownType } from './../../src/components/Dropdown/Dropdown.Props';
import { Label } from './../../src/components/Label/Label';
import { Icon } from './../../src/components/Icon/Icon';
import { Slider } from './../../src/components/Slider/Slider';
import { Button } from './../../src/components/Button/Button';
import './../../src/components/Icon/symbol-defs.svg';
import { dropdownOptions } from '../MockData/dropdownOptions';
import { DirectionalHint } from '../../src';

export class Index extends React.Component<any, any> {

    public render() {
        return (
            <div>
                <Dropdown
                    dropdownType={DropdownType.selectionDropdown}
                    label="Selection dropdown with arrow and border"
                    onClick={(option, index) => console.log(option, index)}
                    options={dropdownOptions}
                    showArrowIcon={true}
                    hasTitleBorder={true}
                    icon="icon-add"
                />

                <hr />

                <Dropdown
                    dropdownType={DropdownType.selectionDropdown}
                    label="Selection dropdown without arrow and with border"
                    onClick={(option, index) => console.log(option, index)}
                    options={dropdownOptions}
                    showArrowIcon={false}
                    hasTitleBorder={true}
                />

                <hr />

                <Dropdown
                    dropdownType={DropdownType.selectionDropdown}
                    label="Selection dropdown with arrow and without border"
                    onClick={(option, index) => console.log(option, index)}
                    options={dropdownOptions}
                    showArrowIcon={true}
                    hasTitleBorder={false}
                />

                <hr />

                <Dropdown
                    dropdownType={DropdownType.selectionDropdown}
                    label="Selection dropdown without arrow and border"
                    onClick={(option, index) => console.log(option, index)}
                    options={dropdownOptions}
                    showArrowIcon={false}
                    hasTitleBorder={false}
                />

                <hr />

                {/* <Dropdown
                    hasTitleBorder={true}
                    dropdownType={DropdownType.selectionDropdown}
                    label="Disabled Dropdown:"
                    disabled={true}
                    onClick={(option, index) => console.log(option, index)}
                    options={dropdownOptions}
                /> */}

                <Dropdown
                    label="Custom Dropdown with directional hint:"
                    className={'custom-dropdown dropdown-moved'}
                    dropdownType={DropdownType.customDropdown}
                    hasTitleBorder={true}
                    showArrowIcon={true}
                    onCustomSelectionText={() => 'Acceleratio.SPDocKit.EventCollection.Service'}
                    calloutDirectionalHint={DirectionalHint.bottomCenter}
                >
                    <li style={{ display: 'inline-block', padding: '5px', width: '500px' }}>
                        <Icon style={{ paddingTop: '5px' }} iconName={'icon-account'}></Icon>
                        <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                    </li>
                    <li style={{ display: 'inline-block', padding: '5px', width: '500px' }}>
                        <Icon style={{ paddingTop: '5px' }} iconName={'icon-account'}></Icon>
                        <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                    </li>
                </Dropdown>

                <Dropdown icon={'icon-add'} label="Icon Dropdown:" className={'icon-dropdown'} dropdownType={DropdownType.customDropdown}>
                    <Label style={{ paddingLeft: '5px' }}>Header</Label>
                    <hr />
                    <li style={{ display: 'inline-block', padding: '5px', width: '100px' }}>
                        <Icon style={{ paddingTop: '5px' }} iconName={'icon-account'}></Icon>
                        <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                    </li>
                    <li style={{ display: 'inline-block', padding: '5px', width: '100px' }}>
                        <Icon style={{ paddingTop: '5px' }} iconName={'icon-account'}></Icon>
                        <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                    </li>
                </Dropdown>

                <Dropdown icon={'icon-add'} iconClassName={'icon-red-fill'} label="Icon Dropdown with custom class  :" className={'icon-dropdown'} dropdownType={DropdownType.customDropdown}>
                    <Label style={{ paddingLeft: '5px' }}>Header</Label>
                    <hr />
                    <li style={{ display: 'inline-block', padding: '5px', width: '100px' }}>
                        <Icon style={{ paddingTop: '5px' }} iconName={'icon-account'}></Icon>
                        <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                    </li>
                    <li style={{ display: 'inline-block', padding: '5px', width: '100px' }}>
                        <Icon style={{ paddingTop: '5px' }} iconName={'icon-account'}></Icon>
                        <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                    </li>
                </Dropdown>

                <Dropdown
                    label="Custom Dropdown:"
                    className={'custom-dropdown'}
                    dropdownType={DropdownType.customDropdown}
                    hasTitleBorder={true}
                    onCustomSelectionText={() => 'Acceleratio.SPDocKit.EventCollection.Service'}
                >
                    <li style={{ display: 'inline-block', padding: '5px', width: '100px' }}>
                        <Icon style={{ paddingTop: '5px' }} iconName={'icon-account'}></Icon>
                        <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                    </li>
                    <li style={{ display: 'inline-block', padding: '5px', width: '100px' }}>
                        <Icon style={{ paddingTop: '5px' }} iconName={'icon-account'}></Icon>
                        <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                    </li>
                </Dropdown>

                <Dropdown
                    label="Custom Dropdown:"
                    className={'custom-dropdown'}
                    dropdownType={DropdownType.customDropdown}
                    hasTitleBorder={false}
                    showArrowIcon={true}
                    onCustomSelectionText={() => 'Acceleratio.SPDocKit.EventCollection.Service'}
                >
                    <li style={{ display: 'inline-block', padding: '5px', width: '100px' }}>
                        <Icon style={{ paddingTop: '5px' }} iconName={'icon-account'}></Icon>
                        <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                    </li>
                    <li style={{ display: 'inline-block', padding: '5px', width: '100px' }}>
                        <Icon style={{ paddingTop: '5px' }} iconName={'icon-account'}></Icon>
                        <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                    </li>
                </Dropdown>

                <div>
                    <Label>Button + Arrow Dropdown:</Label>
                    <div style={{ display: 'inline-flex' }}>
                        <Button className={'button-primary'} icon={'icon-add'} style={{ borderRadius: '8px 0 0 8px' }}></Button>
                        <Dropdown className={'arrow-dropdown'} dropdownType={DropdownType.customDropdown}>
                            <li className={'dropdown-item'}>Option a</li>
                            <li className={'dropdown-item is-selected'}>Option b</li>
                            <li className={'dropdown-item'}>Option c</li>
                            <li className={'dropdown-item'}>Option d</li>
                        </Dropdown>
                    </div>
                </div>

                <Dropdown icon="icon-add" label="Arrow dropdown" className={'arrow-dropdown'} hasTitleBorder={false} dropdownType={DropdownType.customDropdown}>
                    <li className={'dropdown-item'}>Option a</li>
                    <li className={'dropdown-item is-selected'}>Option b</li>
                    <li className={'dropdown-item'}>Option c</li>
                    <li className={'dropdown-item'}>Option d</li>
                </Dropdown>


                <hr />

                <Dropdown
                    dropdownType={DropdownType.selectionDropdown}
                    label="Error dropdown"
                    onClick={(option, index) => console.log(option, index)}
                    options={dropdownOptions}
                    showArrowIcon={true}
                    hasTitleBorder={true}
                    isValid={false}
                    validationErrorMessage={'Dropdown error tooltip!'}
                />

                <hr />
                <Dropdown
                    dropdownType={DropdownType.selectionDropdown}
                    label="Selection dropdown with arrow and border - loading"
                    onClick={(option, index) => console.log(option, index)}
                    options={dropdownOptions}
                    showArrowIcon={true}
                    hasTitleBorder={true}
                    icon="icon-add"
                    isLoading={true}
                />

            </div>

        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
