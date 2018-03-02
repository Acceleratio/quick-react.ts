import * as React from 'react';
import * as classNames from 'classnames';
import { IDialogProps } from './Dialog.Props';
import { DialogFooter } from './DialogFooter';
import { CommonComponent } from '../Common/Common';
import { getId } from '../../utilities/getId';
import { Layer } from '../../components/Layers/Layer';
import { Popup } from '../Popup';
import { Overlay } from '../../components/Overlay/Overlay';
import { Button } from '../../components/Button/Button';
import { Icon } from '../../components/Icon/Icon';
import './Dialog.scss';
import { autobind } from '../../utilities/autobind';
import { KeyCodes } from '../../utilities/KeyCodes';

export interface IDialogState {
    isOpen?: boolean;
    isAnimatingOpen?: boolean;
    isAnimatingClose?: boolean;
    id?: string;
    dialogClass: string;
}

export class Dialog extends CommonComponent<IDialogProps, IDialogState> {
    public static defaultProps: IDialogProps = {
        isOpen: false,
        isDarkOverlay: true,
        isBlocking: true,
        hasCloseXButton: true,
        className: '',
        containerClassName: '',
        contentClassName: ''
    };

    private readonly windowPadding = 70;

    private _containerRef: HTMLDivElement;

    constructor(props: IDialogProps) {
        super(props);

        this._onDialogRef = this._onDialogRef.bind(this);

        this.state = {
            id: getId('dialog'),
            isOpen: props.isOpen,
            isAnimatingOpen: props.isOpen,
            isAnimatingClose: false,
            dialogClass: ''
        };
    }

    public componentDidUpdate() {
        this._checkDialogHeight(this._containerRef);
    }

    public componentWillReceiveProps(newProps: IDialogProps) {
        // Opening the dialog
        if (newProps.isOpen && !this.state.isOpen) {
            this.setState({
                isOpen: true,
                isAnimatingOpen: true,
                isAnimatingClose: false
            });
        }

        // Closing the dialog
        if (!newProps.isOpen && this.state.isOpen) {
            this.setState({
                isOpen: false,
                isAnimatingOpen: false,
                isAnimatingClose: true
            });
        }
    }

    public render() {
        let {
            hasCloseXButton,
            isBlocking,
            isDarkOverlay,
            onDismiss,
            onLayerDidMount,
            onLayerMounted,
            subText,
            icon,
            title,
            layerClassName,
            useOpenCloseAnimation
        } = this.props;
        useOpenCloseAnimation = useOpenCloseAnimation === undefined ? true : useOpenCloseAnimation;
        let { id, isOpen, isAnimatingOpen, isAnimatingClose } = this.state;

        if (!isOpen) {
            return null;
        }

        let subTextContent;

        const dialogClassName = classNames(
            'dialog',
            this.props.className,
            {
                'is-open': isOpen,
                'is-animatingOpen': isAnimatingOpen && useOpenCloseAnimation,
                'is-animatingClose': isAnimatingClose && useOpenCloseAnimation
            }
        );

        const dialogMainClass = classNames('dialog-main', this.props.containerClassName, this.state.dialogClass);

        let groupings = this._groupChildren();

        if (subText) {
            subTextContent = <span className={'dialog-subText'} id={id + '-subText'}>{subText}</span>;
        }

        return (
            <Layer onLayerDidMount={onLayerMounted || onLayerDidMount} className={classNames(layerClassName, 'dropdown-projected-layer')}>
                <Popup
                    role="dialog"
                    onDismiss={onDismiss}
                    style={{ height: '100%' }}>
                    <div className={dialogClassName}
                        ref={this._onDialogRef}>
                        <Overlay isDarkThemed={isDarkOverlay} onClick={isBlocking ? null : onDismiss} />
                        <div
                            className={dialogMainClass}
                            ref={this._getContainerRef}
                            tabIndex={0}
                            onKeyUp={this._onContainerKeyUp}
                        >
                            <div className={classNames('dialog-header', this.props.headerClassName)}>
                                <div className={'dialog-title'} id={id + '-title'}>{title}</div>
                                <div className={'dialog-topButton'}>
                                    {hasCloseXButton &&
                                        <Icon
                                            disabled={false}
                                            className={'dialog-button dialog-button-close'}
                                            onClick={onDismiss}
                                            iconName={'icon-delete'} />
                                    }
                                </div>
                            </div>
                            <div className={'dialog-inner'}>
                                <div className={classNames('dialog-content', this.props.contentClassName)}>
                                    {icon &&
                                        <Icon className={'dialog-icon'} iconName={icon}></Icon>
                                    }
                                    {subTextContent}
                                    {groupings.contents}
                                </div>
                                {groupings.footers}
                            </div>
                        </div>
                    </div>
                </Popup>
            </Layer>
        );
    }

    @autobind
    private _getContainerRef(ref: HTMLDivElement) {
        this._containerRef = ref;
        this._checkDialogHeight(ref);
    }

    private _checkDialogHeight(ref: HTMLDivElement) {
        if (ref) {
            if (Math.abs(window.innerHeight - ref.clientHeight) <= this.windowPadding) {
                this.setState({ ...this.state, dialogClass: 'dialog-container' });
            }
        }
    }

    @autobind
    private _onContainerKeyUp(ev: React.KeyboardEvent<HTMLElement>) {
        switch (ev.which) {
            case KeyCodes.escape:
                if (this.props.onDismiss) {
                    this.props.onDismiss();
                }
                break;
            default:
                return;
        }
    }

    private _groupChildren(): { footers: any[]; contents: any[]; } {
        let groupings: { footers: any[]; contents: any[]; } = {
            footers: [],
            contents: []
        };

        React.Children.map(this.props.children, child => {
            if (typeof child === 'object' && child !== null && child.type === DialogFooter) {
                groupings.footers.push(child);
            } else {
                groupings.contents.push(child);
            }
        });

        return groupings;
    }

    private _onDialogRef(ref: HTMLDivElement) {
        if (ref) {
            this._events.on(ref, 'animationend', this._onAnimationEnd);
        } else {
            this._events.off();
        }
    }

    private _onAnimationEnd(ev: AnimationEvent) {
        // The dialog has just opened (faded in)
        if (ev.animationName.indexOf('fadeIn') > -1) {
            this.setState({
                isOpen: true,
                isAnimatingOpen: false
            });

            if (this._containerRef) {
                this._containerRef.focus();
            }
        }

        // The dialog has just closed (faded out)
        if (ev.animationName.indexOf('fadeOut') > -1) {
            this.setState({
                isOpen: false,
                isAnimatingClose: false
            });

            // Call the onDismiss callback
            if (this.props.onDismiss) {
                this.props.onDismiss();
            }
        }
    }
}
