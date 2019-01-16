import * as React from 'react';

import './Carousel.scss';
import { Button } from '../Button';
import classNames = require('classnames');

export interface CarouselStepProps {
    header?: React.ReactNode;
    stepContent: React.ReactNode;
}

export interface CarouselProps {
    initialStep?: number;
    steps: Array<CarouselStepProps>;
    onStepChanged?(nextStepIndex: number);
    onFinish();
    
    showBackButton?: boolean;
    backButtonText?: string;
    forwardButtonText?: string;
    finishButtonText?: string;
}

export interface CarouselState {
    selectedStepIndex: number;
    numberOfSteps: number;
}

export class Carousel extends React.Component<CarouselProps, CarouselState> {
    static defaultProps: Partial<CarouselProps> = {
        forwardButtonText: 'Next',
        backButtonText: 'Back',
        finishButtonText: 'Finish',
        showBackButton: true
    };

    constructor(props: CarouselProps) {
        super(props);
        this.state = {
            selectedStepIndex: props.initialStep || 0,
            numberOfSteps: props.steps.length
        };
    }

    public render() {
        const { finishButtonText, forwardButtonText, backButtonText } = this.props;
        const stepProps = this._getSelectedStepProps();
        const showBackButton = this.state.selectedStepIndex > 0 && this.props.showBackButton;
        const buttonText = this._isLastStep() ? finishButtonText : forwardButtonText;
        const backBtnClass = classNames('carousel__footer__back-button', 'button-primary-gray', {'carousel__footer__back-button--hidden' : !showBackButton});

        return (
            <div className="carousel">
                {stepProps.header && <div className="carousel__header">
                    {stepProps.header}
                </div>}
                <div className="carousel__content">
                    {stepProps.stepContent}
                </div>
                <div className="carousel__footer">
                    <Button className={backBtnClass} onClick={this._onBackClicked}>{backButtonText}</Button>
                    {this._renderCarouselSteps()}
                    <Button className="carousel__footer__forward-btton button-primary" onClick={this._onNextClicked}>{buttonText}</Button>
                </div>
            </div>
        );
    }

    private _getSelectedStepProps = (): CarouselStepProps => {
        return this.props.steps[this.state.selectedStepIndex];
    }

    private _isLastStep = () => {
        return this.state.selectedStepIndex === (this.state.numberOfSteps - 1);
    }

    private _onNextClicked = () => {
        if (this._isLastStep()) {
            this.props.onFinish();
            return;
        }

        this.changeStep(this.state.selectedStepIndex + 1);
    }

    private _onBackClicked = () => {
        this.changeStep(this.state.selectedStepIndex - 1);
    }

    public changeStep = (newStepIndex: number) => {
        this.setState({selectedStepIndex: newStepIndex});
        if (this.props.onStepChanged) {
            this.props.onStepChanged(newStepIndex);
        }
    }

    private _renderCarouselSteps = () => {
        return <div className="carousel__footer__steps">
            {this.props.steps.map((step, index) => {
                const className = classNames('carousel__footer__steps__step', {'carousel__footer__steps__step--active': index === this.state.selectedStepIndex});
                return <div key={index} className={className} onClick={() => this.changeStep(index)}></div>;
            })}
        </div>;
    }
}
