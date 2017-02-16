import * as React from 'react';
import * as classNames from 'classnames';
import { IToggleSwitchProps } from './ToggleSwitch.Props';
import './ToggleSwitch.scss';
import { autobind } from '../../utilities/autobind';

export class ToggleSwitch extends React.Component<IToggleSwitchProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            checked : props.checked === undefined ? false : props.checked
        };
    }

    public render() : JSX.Element {
        let{
            checked,
            onChange,
            className
        } = this.props;

        const isChecked = checked === undefined ? this.state.isChecked : checked;

        const switchClassName = classNames(
            className,
            'toggle-switch'
        );
        const slidersClassName = classNames(
            'toggle-slider'
        );
        return(
            <label className={switchClassName}>
                <input type="checkbox" onChange={this._onChange} checked={isChecked}/>
                <div className={slidersClassName}></div>
            </label>
        );
    }

    @autobind
    private _onChange(ev: React.FormEvent<HTMLInputElement>) : void {
        const isChecked = (ev.target as HTMLInputElement).checked;
        if (this.props.onChange) {
            this.props.onChange(isChecked);
        }
        if (this.props.checked === undefined) {
            this.setState({checked : isChecked});
        }
    }
}
