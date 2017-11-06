import * as React from 'react';
import * as classNames from 'classnames';
import './Wizard.scss';
import { IStepProps } from './Step/Step.Props';
import { Button } from '../../components/Button/Button';
import { IButtonProps } from '../../components/Button/Button.Props';
import { autobind } from '../../utilities/autobind';
import { Stepper } from './Stepper/Stepper';
import { WizardStepDirection, IWizardProps, IPage, defaultProps } from './Wizard.Props';

export interface IWizardState {
    currentStep?: number;
}

export class Wizard extends React.Component<IWizardProps, IWizardState> {
    public static defaultProps: IWizardProps = defaultProps;

    constructor(props: IWizardProps) {
        super(props);

        this.state = {
            currentStep: 0
        };
    }

    public componentWillMount() {
        this.props.onPageEnter(0, 1);
    }

    @autobind
    private _nextStep(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if ((this.state.currentStep + 1) !== this.props.steps.length) {
            this.props.onPageLeave(this.state.currentStep, this.state.currentStep + 1, WizardStepDirection.Next);
            this.setState({ currentStep: this.state.currentStep + 1 });
            this.props.onPageEnter(this.state.currentStep + 1, this.state.currentStep + 2);
        }
    }

    @autobind
    private _backStep(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (this.state.currentStep > 0) {
            this.props.onPageLeave(this.state.currentStep, this.state.currentStep - 1, WizardStepDirection.Previous);
            this.setState({ currentStep: this.state.currentStep - 1 });
            this.props.onPageEnter(this.state.currentStep - 1, this.state.currentStep);
        }
    }

    @autobind
    private _renderButtons(): Array<JSX.Element> {
        const currentStepProp = this.props.steps[this.state.currentStep];
        const { currentStep } = this.state;
        const { steps, showNavigationButtons, nextBtnState } = this.props;
        const lastStep = steps.length - 1;

        let buttons: Array<JSX.Element> = [];
        buttons.push(
            <Button
                className="button-textual"
                onClick={this.props.onCancel}
            >
                Cancel
            </Button>
        );

        if (!this.props.showNavigationButtons) {
            return buttons;
        }

        buttons.push(
            <Button
                disabled={this.state.currentStep === 0}
                className="button-primary-gray"
                onClick={this._backStep}
            >
                {this.props.backButtonText}
            </Button>
        );

        if (currentStepProp.optionalButtons) {
            const additionalButtons = currentStepProp.optionalButtons.map((button, index) => {
                const buttonClass = button.className === undefined ? 'button-tertiary' : button.className;
                return (
                    <Button {...{ ...button, className: buttonClass }} key={index}></Button>
                );
            });
            buttons = [...buttons, ...additionalButtons];
        }

        if (currentStep !== lastStep) {
            buttons.push(
                <Button
                    disabled={!this.props.nextBtnState}
                    className="button-primary"
                    onClick={this._nextStep}
                >
                    {this.props.nextButtonText}
                </Button>
            );
        } else {
            buttons.push(
                <Button
                    disabled={!this.props.nextBtnState}
                    className="button-primary"
                    onClick={this.props.onFinish}
                >
                    {this.props.finishButtonText}
                </Button>
            );
        }

        return buttons;
    }

    private get stepClassName() {
        const className = this.props.steps[this.state.currentStep].className;
        return className ? className : '';
    }

    public render(): JSX.Element {
        const stepWindowClassName = classNames(
            'wizard-step-window',
            this.stepClassName
        );

        return (
            <div className="wizard-container">
                <div className="wizard-title">{this.props.title}</div>
                <div className="wizard-content">
                    <Stepper
                        steps={this.props.steps}
                        activeStep={this.state.currentStep}
                    />
                </div>
                <div className={stepWindowClassName}>
                    {
                        this.props.onPageRender(this.state.currentStep)
                    }
                    <div className="wizard-footer-navigation">
                        <div className="wizard-right-navigation-btn-page-container">
                            {
                                this._renderButtons()
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
