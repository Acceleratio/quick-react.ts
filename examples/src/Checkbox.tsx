/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Checkbox } from './../../src/components/Checkbox/Checkbox';
import { Icon } from '../../src/components/Icon/Icon';
import { CellElement } from '../../src/components/TreeGrid/CellElement';
import { VirtualizedTreeViewCheckBox } from '../../src/components/TreeFilter/VirtualizedTreeViewCheckBox';
import { CheckStatus } from '../../src';

const $secondaryColor = '#4D4D4F';

export class Index extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            checked: false,
            iconChecked: false,
            checkedWhite: false,
            checkStatus: CheckStatus.ChildChecked
        };
    }

    onCheckBoxChange = () => {
        let newChecked = CheckStatus.ChildChecked;
        if (this.state.checkStatus === CheckStatus.NotChecked) {
            this.setState({ checkStatus: CheckStatus.Checked });
        } else if (this.state.checkStatus === CheckStatus.Checked) {
            this.setState({ checkStatus: CheckStatus.NotChecked });
        } else {
            this.setState({ checkStatus: CheckStatus.NotChecked });
        }
    }

    public render() {
        return (
            <div>
                {/* <Checkbox
                    label={'This is checkbox'}
                    onChange={(ev, checked) => this._onChange()}
                    checked={this.state.checked}
                /> */}
                <Checkbox
                    onChange={(ev, checked) => this._onChange()}
                    checked={this.state.checked}
                />
                <CellElement id={'1'} element={<Icon iconName="icon-arrow_down_right" className="expand-collapse-action-icon" />} />
                <VirtualizedTreeViewCheckBox checked={this.state.checkStatus} itemId="1" text="" onChange={this.onCheckBoxChange} />
                {/* <Checkbox
                    label={'This is disabled checkbox'}
                    disabled={true}
                    defaultChecked={true}
                />
                <Checkbox
                    label={'This is checkbox with icon'}
                    onChange={(ev, checked) => this._onCheckboxIconChange()}
                    iconClassName={'icon-user'}
                    checked={this.state.iconChecked}
                />

                <div style={{ backgroundColor: $secondaryColor, paddingLeft: '10px' }}>
                    <Checkbox
                        label={'This is white checkbox'}
                        onChange={(ev, checked) => this._onWhiteChange()}
                        checked={this.state.checkedWhite}
                        className="checkbox-white"
                    />
                </div>

                <div style={{ backgroundColor: $secondaryColor, paddingLeft: '10px' }}>
                    <Checkbox
                        label={'This is disabled white checkbox'}
                        disabled={true}
                        checked={this.state.iconChecked}
                        className="checkbox-white"
                    />
                </div> */}
            </div>
        );
    }

    private _onChange() {
        this.setState({ checked: !this.state.checked });
    }

    private _onCheckboxIconChange() {
        this.setState({ iconChecked: !this.state.iconChecked });
    }

    private _onWhiteChange() {
        this.setState({ checkedWhite: !this.state.checkedWhite });
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
