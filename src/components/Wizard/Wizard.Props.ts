import { IStepProps } from './Step/Step.Props';
import { IButtonProps } from '../Button/Button.Props';

export interface IPage {
    content: JSX.Element;
    id: number;
}

export enum WizardStepDirection {
    Next, Previous
}

export interface IWizardStep {
    index: number;
    title: string;
    description?: string;
    optionalButtons?: Array<IButtonProps>;
    className?: string;
}

export interface IWizardProps {
    steps: Array<IWizardStep>;
    onPageRender?: (index: number) => JSX.Element;
    onPageEnter?: (currentStepIndex: number, nextStepIndex: number) => void;
    onPageLeaving?: (currentStepIndex: number, nextStepIndex: number, direction: WizardStepDirection) => boolean;
    onPageLeave?: (currentStepIndex: number, nextStepIndex: number, direction: WizardStepDirection) => void;
    onFinish: () => void;
    onCancel: () => void;
    currentStep?: number;
    currentPage?: IPage;
    title?: string;
    nextBtnState?: boolean;
    backBtnState?: boolean;
    showNavigationButtons?: boolean;
    nextButtonText?: string;
    backButtonText?: string;
    finishButtonText?: string;
    showContainer?: boolean;
}

const nullFunc = (currentStepIndex?: number, nextStepIndex?: number, direction?: WizardStepDirection): void => { };

export const defaultProps: any = {
    showNavigationButtons: true,
    onPageEnter: nullFunc,
    onPageLeave: nullFunc,
    showContainer: false,
    nextButtonText: 'Next',
    backButtonText: 'Back',
    finishButtonText: 'Finish'
};
