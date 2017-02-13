import 'babel-polyfill';
import 'ts-helpers';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Test } from './components/Test/Test';
import { Button } from './components/Button/Button';
import { ButtonType } from './components/Button/Button.Props';
import { Icon } from './components/Icon/Icon';
import { Dropdown } from './components/Dropdown/Dropdown';
import { DropdownType } from './components/Dropdown/Dropdown.Props';
import { LeftNavigation } from './components/LeftNavigation/LeftNavigation';
import { MainNavigation } from './components/MainNavigation/MainNavigation';
import { Ribbon } from './components/Ribbon/Ribbon';
import { History } from './components/History/History';
import { Checkbox } from './components/Checkbox/Checkbox';
import { Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs';
import { Label } from './components/Label/Label';
import { Callout } from './components/Callout/Callout';
import { ContextualMenu } from './components/ContextualMenu/ContextualMenu';
import { DirectionalHint } from './utilities/DirectionalHint';
import { IPoint } from './utilities/IPoint';
import { ChoiceGroup } from './components/ChoiceGroup/ChoiceGroup';
import { AddToFavorites } from './components/AddToFavorites/AddToFavorites';
import { TextField } from './components/TextField/TextField';
import { Spinner } from './components/Spinner/Spinner';
import { SpinnerType } from './components/Spinner/Spinner.Props';
import { Slider } from './components/Slider/Slider';
import { MessageBar } from './components/MessageBar/MessageBar';
import { MessageBarType } from './components/MessageBar/MessageBar.Props';
import { Search } from './components/Search/Search';
import { Pivot } from './components/Pivot/Pivot';
import { PivotItem } from './components/Pivot/PivotItem';
import { Dialog } from './components/Dialog/Dialog';
import { DialogFooter } from './components/Dialog/DialogFooter';
import { StatusBar } from './components/StatusBar/StatusBar';
import { Treeview } from './components/Treeview/Treeview';
import { ServerDetails } from './components/ServerDetails/ServerDetails';
import { LineChart } from './components/LineChart/LineChart';

import { DataGenerator } from './utilities/DataGenerator';

export class Index extends React.Component<any, any> {

    private _generator: DataGenerator;

    constructor() {
        super();
        this._generator = new DataGenerator();
        this.state = {
            showDialog: false,
            selector: true,
            cpu: '74%',
            data: this._generator.generateValues()
        };

        // setInterval(() => this.setState({data: this._generator.generateValues()}), 5000);
    }

    componentDidMount() {
    }

    public render() {
        return (
            <div>
                <Ribbon items={[]}></Ribbon>
                <AddToFavorites favorited={true} />
                <AddToFavorites favorited={false} />
                <Callout> AAAAAAA<Callout>BBBBBBBB</Callout> </Callout>
                <MainNavigation id={'mainNavigation'} logo={'icon-Logo'}>
                    <Icon iconName={'icon-Buy'}></Icon>
                </MainNavigation>
                <br />
                <MessageBar messageBarType={MessageBarType.warning} hasDontShowAgain={true} onDismiss={() => { console.log('test'); } }>Ovo je message bar!</MessageBar>
                <br />
                <Pivot onLinkClick={(item, ev) => console.log(item)}>
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
                <Button>WAT</Button>
                <br />
                <br />
                <Button onClick={this._showDialog.bind(this)}>Open Dialog</Button>
                <Dialog
                    isOpen={this.state.showDialog}
                    onDismiss={this._closeDialog.bind(this)}
                    title={'All emails together'}
                    subText={'Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.'}
                    containerClassName={'dialogMainOverride'}>
                    <DialogFooter>
                        <Button buttonType={ButtonType.primary} onClick={this._closeDialog.bind(this)}>Save</Button>
                        <Button onClick={this._closeDialog.bind(this)}>Cancel</Button>
                    </DialogFooter>
                </Dialog>
                <br />
                <div style={{ 'width': '150px' }}>
                    <Dropdown
                        hasTitleBorder={true}
                        dropdownType={DropdownType.selectionDropdown}
                        label="Basic example:"
                        options={
                            [
                                { key: 'A', text: 'Option a', icon: 'icon-Add' },
                                { key: 'B', text: 'Option b', icon: 'icon-Buy' },
                                { key: 'C', text: 'Option c', icon: 'icon-User' },
                                { key: 'D', text: 'Option d' },
                                { key: 'E', text: 'Option e' },
                                { key: 'F', text: 'Option f' },
                                { key: 'G', text: 'Option g' },
                                { key: 'H', text: 'Option h', selected: true },
                                { key: 'I', text: 'Option i' },
                                { key: 'J', text: 'Option j' },
                            ]
                        }
                        />
                </div>
                <div>
                    <Dropdown icon={'icon-SwitchView'} dropdownType={DropdownType.customDropdown}>
                        <Label>Header</Label>
                        <hr />
                        <li style={{ 'display': 'inline-flex' }}>
                            <Icon iconName={'icon-Account'}></Icon>
                            <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                        </li>
                        <li style={{ 'display': 'inline-flex' }}>
                            <Icon iconName={'icon-Account'}></Icon>
                            <Slider min={0} max={50} step={5} defaultValue={20}></Slider>
                        </li>
                    </Dropdown>
                </div>
                <br />
                <Search
                    onChange={(newValue) => console.log('SearchBox onChange fired: ' + newValue)}
                    onSearch={(newValue) => console.log('SearchBox onSearch fired: ' + newValue)}
                    />
                <br />
                <Icon iconName={'icon-Account'}></Icon>
                <br />
                <Breadcrumbs items={[
                    { text: 'Files', 'key': 'Files' },
                    { text: 'This is folder 1', key: 'f1', href: '#1' },
                    { text: 'This is folder 2', key: 'f2', href: '#2' },
                    {
                        text: 'This is folder 3', key: 'f3', href: '#3', children: [
                            { text: 'This is folder 100', key: 'f100' },
                            { text: 'This is folder 200', key: 'f200' }
                        ]
                    },
                    { text: 'This is folder 4', key: 'f4', href: '#4' },
                    { text: 'This is folder 5', key: 'f5', onClick: () => { console.log('click'); } }
                ]}
                    maxDisplayedItems={3}>
                </Breadcrumbs>
                <br />
                <LeftNavigation id={'leftNavigation'} options={[
                    { text: 'Home', id: 'Home', href: 'http://Acceleratio.net', icon: 'icon-Help' },
                    { text: 'Activity', id: 'Activity', href: '#1', disabled: true, icon: 'icon-Account' },
                    { text: 'News', id: 'News', href: '#2', icon: 'icon-Add' },
                    { text: 'Documents', id: 'Documents', href: '#3', selected: true, icon: 'icon-Alert' },
                    { text: 'Books', id: 'Books', href: '#4', icon: 'icon-Trash' }
                ]}
                    ></LeftNavigation>
                <br />
                <History />
                <br />
                <Checkbox label={'This is checkbox'} onChange={(ev, checked) => console.log('aaa')} />
                <Checkbox label={'This is disabled checkbox'} disabled={true} defaultChecked={true} />
                <br />
                <ChoiceGroup options={[
                    { key: 'A', text: 'Option A' },
                    { key: 'B', text: 'Option B', checked: true },
                    { key: 'C', text: 'Option C', disabled: true },
                    { key: 'D', text: 'Option D', checked: true, disabled: true }
                ]}
                    label="Pick one">
                </ChoiceGroup>
                <br />
                <Slider label={'This is slider:'} min={0} max={50} step={5} defaultValue={20} showValue={true}></Slider>
                <br />
                <Label>I'm a Label</Label>
                <Label disabled={true}>I'm a disabled Label</Label>
                <Label required={true}>I'm a required Label</Label>
                <br />
                <TextField label="TextField with a placeholder" placeholder="Now I am a Placeholder" />
                <TextField label="Disabled TextField" disabled={true} />
                <TextField label="Multiline TextField" multiline rows={4} cols={50} />
                <br />
                <Label>Normal Spinner</Label>
                <Spinner />
                <Label>Large Spinner With Label</Label>
                <Spinner type={SpinnerType.large} label="Seriously, still loading..." />
                <br />
                <Treeview onCheckboxChanged={this._onTreeViewChange}
                    items={[
                        { id: 'A', text: 'Option A', isOpen: false, children: [{ text: 'Option B', checked: false, id: 'B1' }, { text: 'Option B', id: 'B2'}, { text: 'Option B', id: 'B3' }] },
                        { id: 'C', text: 'Option C', isOpen: false, children: [{ text: 'Option D', id: 'D1' }, { text: 'Option D', id: 'D2' }, { text: 'Option D', id: 'D3' }] },
                        { id: 'E', text: 'Option E', isOpen: false, children: [{ text: 'Option F', id: 'F1' }, { text: 'Option F', id: 'F2' }, { text: 'Option F', id: 'F3' }] },
                        { id: 'G', text: 'Option G', isOpen: false, children: [{ text: 'Option H', id: 'H1' }, { text: 'Option H', id: 'H2' }, { text: 'Option H', id: 'H3' }] }
                    ]}>
                </Treeview>
                <br />
                <StatusBar text={'Initializing index...'}></StatusBar>
                <br />
                <ServerDetails serverStatus='OK'
                    headerData={{serverName: 'ServerName123456', 
                                fqdmServerName: 'ServerName123456.companylocal',
                                numberOfUsers: 3432,
                                diskData: {status: 'Error',
                                            disks: [
                                                {driveLetter: 'C:', sizeInUse: '84', totalSize: '249', filledPercentage: '30%'},
                                                {driveLetter: 'D:', sizeInUse: '120', totalSize: '249', filledPercentage: '47%'}]}}}
                    cpuData={{status: 'Error', cpuUtilization: this.state.cpu}}
                    memoryData={{status: 'Warning', memoryUsage: '7 GB', committedMemory: '7GB/10GB (70%)'}}
                    diskData={{status: 'OK', currentRWSpeed: '0,1 MB/s', rwSpeedsPerPartition: [this.state.cpu, '50.10 kB/s', '23.47 kB/s']}}
                    networkData={{status: 'OK', currentSpeed: '0,1 Mbps', speedsPerInterface: ['4.49 Mbps', '2.63 Mbps', '0.3 Mbps']}}
                ></ServerDetails><br/>
                <LineChart 
                    title={'CPU USAGE'}
                    data={this.state.data} 
                    width={330} 
                    height={200} 
                ></LineChart>
            </div>);
    };

    private _onTreeViewChange(ev, itemId, checked) {
        console.log(itemId + ':' + checked);
    }
    
    private _showDialog() {
        this.setState({ showDialog: true });
    }

    private _closeDialog() {
        this.setState({ showDialog: false });
    }
};

ReactDOM.render(<Index />, document.getElementById('root'));
