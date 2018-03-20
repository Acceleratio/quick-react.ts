/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Pivot } from './../../src/components/Pivot/Pivot';
import { PivotItem } from './../../src/components/Pivot/PivotItem';
import { Label } from './../../src/components/Label/Label';
import { PivotLinkFormat } from '../../src/components/Pivot/Pivot.Props';

export class Index extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <Pivot onLinkClick={(item, ev) => console.log(item)}>
                    <PivotItem linkText={'My Files'} itemCount={10}>
                        <Label>Pivot #1</Label>
                    </PivotItem>
                    <PivotItem linkText={'Recent'} disabled={true}>
                        <Label>Pivot #2</Label>
                    </PivotItem>
                    <PivotItem linkText={'Shared with me'}>
                        <Label>Pivot #3</Label>
                    </PivotItem>
                </Pivot>

                <br />
                <Pivot onLinkClick={(item, ev) => console.log(item)} linkFormat={PivotLinkFormat.tabs}>
                    <PivotItem linkText={'My Files'}>
                        <Label>Pivot #1</Label>
                    </PivotItem>
                    <PivotItem linkText={'Recent'}>
                        <Label>Pivot #2</Label>
                    </PivotItem>
                    <PivotItem linkText={'Shared with me'}>
                        <Label>Pivot #3</Label>
                    </PivotItem>
                </Pivot>

                <br />
                <Pivot onLinkClick={(item, ev) => console.log(item)} linkFormat={PivotLinkFormat.tabs} className={'pivot-tabs-gray'}>
                    <PivotItem linkText={'My Files'}>
                        <Label>Pivot #1</Label>
                    </PivotItem>
                    <PivotItem linkText={'Recent'}>
                        <Label>Pivot #2</Label>
                    </PivotItem>
                    <PivotItem linkText={'Shared with me'}>
                        <Label>Pivot #3</Label>
                    </PivotItem>
                </Pivot>

                <br />
                <Pivot onLinkClick={(item, ev) => console.log(item)} linkFormat={PivotLinkFormat.minimalTabs}>
                    <PivotItem linkText={'My Files'}>
                        <Label>Pivot #1</Label>
                    </PivotItem>
                    <PivotItem linkText={'Recent'} disabled={true}>
                        <Label>Pivot #2</Label>
                    </PivotItem>
                    <PivotItem linkText={'Shared with me'}>
                        <Label>Pivot #3</Label>
                    </PivotItem>
                </Pivot>

                <br />
                <Pivot onLinkClick={(item, ev) => console.log(item)}>
                    <PivotItem linkText={'My Files'} linkIcon={'icon-user'}>
                        <Label>Pivot #1</Label>
                    </PivotItem>
                    <PivotItem linkText={'Recent'} >
                        <Label>Pivot #2</Label>
                    </PivotItem>
                    <PivotItem linkText={'Shared with me'} linkIcon={'icon-add'}>
                        <Label>Pivot #3</Label>
                    </PivotItem>
                </Pivot>
                <br />
                <Pivot onLinkClick={(item, ev) => console.log(item)} textSize={22} >
                    <PivotItem linkText={'My Files'} itemCount={10}>
                        <Label>Pivot #1</Label>
                    </PivotItem>
                    <PivotItem linkText={'Recent'} disabled={true}>
                        <Label>Pivot #2</Label>
                    </PivotItem>
                    <PivotItem linkText={'Shared with me'}>
                        <Label>Pivot #3</Label>
                    </PivotItem>
                </Pivot>
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
