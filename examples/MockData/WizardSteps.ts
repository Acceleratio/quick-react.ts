import { IWizardStep } from '../../src/components/Wizard/Wizard.Props';

export const steps: Array<IWizardStep> = [
    {
        title: 'Script Details',
        index: 0,
        description: 'Description of script details'
    },
    {
        title: 'Enter Powershell',
        index: 1
    },
    {
        title: 'Script Results',
        index: 2
    },
    {
        title: 'Some really really long title',
        index: 2
    },
    {
        title: 'Some wizard step',
        index: 2
    },
    {
        title: 'Finish',
        index: 3,
        optionalButtons: [
            {
                children: 'Schedule',
                className: 'button-tertiary'
            }
        ]
    }
];
