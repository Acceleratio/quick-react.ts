/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from './../../src/components/Button/Button';
import { Dialog } from './../../src/components/Dialog/Dialog';
import { DialogFooter } from './../../src/components/Dialog/DialogFooter';
import { TextField } from './../../src/components/TextField/TextField';
import { DialogFooterSection, DialogFooterSectionPosition } from './../../src/components/Dialog/DialogFooterSection';

export class Index extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = { showDialog: false, showDialog2: false, showDialog3: false };
    }

    public render() {
        return (
            <div>
                <Button onClick={this._toggleDialog.bind(this)}>Open Dialog</Button> <br /><br />
                <Button onClick={this._toggleDialog2.bind(this)}>Open Dialog2</Button> <br /><br />

                <Dialog
                    isOpen={this.state.showDialog}
                    onDismiss={this._toggleDialog.bind(this)}
                    headerClassName="header-inverse"
                >
                    <div style={{ width: '500px' }}>
                        <TextField label="TextField with a placeholder:" placeholder="Now I am a Placeholder" /> <br />
                        <TextField label="Required TextField:" required={true} /> <br />
                        <TextField label="Disabled TextField:" disabled={true} /> <br />
                        <TextField label="Error TextField:" errorMessage={'This is error message, please fix it!'} /> <br />
                        <TextField label="Description TextField:" description={'Description Message'} /> <br />
                        <TextField label={'Underlined TextField:'} placeholder="Underlined TextField" underlined /> <br />
                        <TextField label="Multiline TextField:" multiline rows={4} cols={50} />
                        <TextField label="TextField with a placeholder:" placeholder="Now I am a Placeholder" /> <br />
                        <TextField label="Required TextField:" required={true} /> <br />
                        <TextField label="Disabled TextField:" disabled={true} /> <br />
                        <TextField label="Error TextField:" errorMessage={'Error Message'} /> <br />
                        <TextField label="Description TextField:" description={'Description Message'} /> <br />
                        <TextField label={'Underlined TextField:'} placeholder="Underlined TextField" underlined /> <br />
                        <TextField label="Multiline TextField:" multiline rows={4} cols={50} />
                    </div>

                    <DialogFooter>
                        <Button className={'button-textual'} onClick={this._toggleDialog.bind(this)}>Cancel</Button>
                        <Button className={'button-primary-gray'} onClick={this._toggleDialog.bind(this)}>Discard</Button>
                        <Button className={'button-primary'} onClick={this._toggleDialog.bind(this)}>Save</Button>
                    </DialogFooter>
                </Dialog>

                <Dialog
                    isOpen={this.state.showDialog2}
                    onDismiss={this._toggleDialog2.bind(this)}
                    title={'Warning'}
                    subText={'This is warning message and you have to fix it!'}
                >
                    <DialogFooter>
                        <DialogFooterSection position={DialogFooterSectionPosition.Left}>
                            <a href={''} onClick={() => alert('help me!')}>Help</a> |
                            <a href={''} onClick={() => alert('legal stuff')}>Privacy Policy Statement</a>
                        </DialogFooterSection>
                        <DialogFooterSection position={DialogFooterSectionPosition.Right}>
                            <Button className={'button-textual'} onClick={this._toggleDialog2.bind(this)}>Cancel</Button>
                            <Button className={'button-primary'} onClick={this._toggleDialog2.bind(this)}>Save</Button>
                        </DialogFooterSection>
                    </DialogFooter>
                </Dialog>
            </div>
        );
    }

    private _toggleDialog() {
        this.setState({ showDialog: !this.state.showDialog });
    }

    private _toggleDialog2() {
        this.setState({ showDialog2: !this.state.showDialog2 });
    }
}
ReactDOM.render(<Index />, document.getElementById('root'));
