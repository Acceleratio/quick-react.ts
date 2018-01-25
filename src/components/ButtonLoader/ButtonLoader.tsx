import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { IButtonLoaderProps, IButtonLoaderState } from './ButtonLoader.Props';
import './ButtonLoader.scss';
import { Button } from '../Button/Button';
import { autobind } from '../../utilities/autobind';

export class ButtonLoader extends React.Component<IButtonLoaderProps, IButtonLoaderState> {
    public componentDidMount() {
        this.setState({ width: ReactDOM.findDOMNode(this.refs.refButton).clientWidth });
    }

    public render() {
        const buttonVisible = !this.props.isLoading && !this.props.isSucces && !this.props.isError;
        return (
            <span className={this.props.className}>
                <Button
                    ref="refButton"
                    onClick={this.props.onClick}
                    className={this.props.className}
                    isVisible={buttonVisible}>
                    {this.props.buttonText}
                </Button>
                {this.props.isLoading &&
                    <Button
                        className={this.props.className}
                        isLoading={this.props.isLoading}
                        width={this.state.width}>
                    </Button>
                }
                {this.props.isSucces &&
                    <Button
                        className="button-succes"
                        icon="icon-checkmark"
                        width={this.state.width}>
                </Button>
                }
                {this.props.isError &&
                    <Button
                        className="button-error"
                        icon="icon-error"
                        width={this.state.width}>
                </Button>
                }
            </span>
        );
    }
}
