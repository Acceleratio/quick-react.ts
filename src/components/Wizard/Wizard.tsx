import * as React from 'react';
import * as classNames from 'classnames';
import './Wizard.scss';
import { IStepProps } from './Step/Step.Props';
import { Button } from '../../components/Button/Button';
import { IButtonProps } from '../../components/Button/Button.Props';
import { autobind } from '../../utilities/autobind';
import { Stepper } from './Stepper/Stepper';
import { WizardStepDirection, IWizardProps, IPage, defaultProps } from './Wizard.Props';
import { Icon } from '../../components/Icon/Icon';

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
            if (this.props.onPageLeaving && !this.props.onPageLeaving(this.state.currentStep, this.state.currentStep + 1, WizardStepDirection.Next)) {
                return;
            }
            this.props.onPageLeave(this.state.currentStep, this.state.currentStep + 1, WizardStepDirection.Next);
            this.setState({ currentStep: this.state.currentStep + 1 });
            this.props.onPageEnter(this.state.currentStep + 1, this.state.currentStep + 2);
        }
    }

    @autobind
    private _backStep(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (this.state.currentStep > 0) {
            if (this.props.onPageLeaving && !this.props.onPageLeaving(this.state.currentStep, this.state.currentStep - 1, WizardStepDirection.Previous)) {
                return;
            }
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
        if (this.props.showHelpButton && this.props.onHelpClicked) {
            buttons.push(
                <Button
                    href="#"
                    className="link wizard-help"
                    onClick={this.props.onHelpClicked}
                >
                    Help
                </Button>
            );
        }

        buttons.push(
            <Button
                className="button-textual wizard-cancel"
                onClick={this.props.onCancel}
            >
                Cancel
            </Button>
        );

        if (!this.props.showNavigationButtons) {
            return buttons;
        }

        const backBtnState = this.props.backBtnState !== null ? this.props.backBtnState : this.state.currentStep !== 0;

        buttons.push(
            <Button
                disabled={!backBtnState}
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
                    isLoading ={this.props.isWizardFinishing}
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
        const currentStepProp = this.props.steps[this.state.currentStep];

        return (
            <div className="wizard-container">
                <div className="wizard-content">
                    <div className="wizard-title-container">
                        <div className="wizard-back-icon-container">
                            <Icon className="icon-arrow-left wizard-back-icon" onClick={this.props.onCancel} />
                        </div>
                        <div className="wizard-title">{this.props.title}</div>
                    </div>
                    {this.props.stepsVisible &&
                        <Stepper
                            steps={this.props.steps}
                            activeStep={this.state.currentStep}
                        />
                    }
                </div>
                <div className={stepWindowClassName}>
                    {
                        currentStepProp.description && <div className="wizard-step_header">
                            {currentStepProp.description}
                        </div>
                    }
                    {
                        this.props.onPageRender(this.state.currentStep)
                    }

                </div>

                <div className="wizard-footer-navigation">
                    <div className="wizard-right-navigation-btn-page-container">
                        {
                            this._renderButtons()
                        }
                    </div>
                </div>
            </div>
        );
    }
}
