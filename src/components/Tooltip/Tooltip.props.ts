import { DirectionalHint } from '../../utilities/DirectionalHint';

export interface ITooltipProps {
    title?: string;
    content: string | JSX.Element;
    className?: string;
    targetElement?: HTMLElement;
    directionalHint?: DirectionalHint;
    showTooltip?: boolean;
    onTooltipToggle?(isTooltipVisible: boolean): void;
    containerClass?: string;
    delayMs?: number;
    closeDelayMs?: number;
}
