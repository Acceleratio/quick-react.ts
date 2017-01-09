import * as React from 'react';
import * as classNames from 'classnames';
import { IDialogProps } from './Dialog.Props';
import { DialogFooter } from './DialogFooter';
import { CommonComponent } from '../Common/Common';
import { getId } from '../../utilities/getId';
import { Layer } from '../../components/Layers/Layer';
import { Popup } from '../../components/Popup/Popup';
import { Overlay } from '../../components/Overlay/Overlay';
import { Button } from '../../components/Button/Button';
import { ButtonType } from '../../components/Button/Button.Props';
import { Icon } from '../../components/Icon/Icon';
import { IconName } from '../../components/Icon/IconName';
import './Dialog.scss';

export interface IDialogState {
    isOpen ?: boolean;
    isAnimatingOpen ?: boolean;
    isAnimatingClose ?: boolean;
    id ?: string;
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

    constructor(props: IDialogProps) {
        super(props);

        this._onDialogRef = this._onDialogRef.bind(this);

        this.state = {
            id: getId('dialog'),
            isOpen: props.isOpen,
            isAnimatingOpen: props.isOpen,
            isAnimatingClose: false
        };
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
            title
        } = this.props;

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
                'is-animatingOpen': isAnimatingOpen,
                'is-animatingClose': isAnimatingClose
            }
        );

        let groupings = this._groupChildren();

        if (subText) {
            subTextContent = <p className={'dialog-subText'} id={ id + '-subText' }>{ subText }</p>;
        }

        return (
            <Layer onLayerDidMount={ onLayerMounted || onLayerDidMount }>
                <Popup
                    role="dialog"
                    onDismiss={ onDismiss }>
                    <div className={ dialogClassName }
                        ref={ this._onDialogRef }>
                        <Overlay isDarkThemed={ isDarkOverlay } onClick={ isBlocking ? null : onDismiss } />
                        <div className={ classNames('dialog-main', this.props.containerClassName) }>
                            <div className={'dialog-header'}>
                                <p className={'dialog-title'} id={ id + '-title' }>{ title }</p>
                                <div className={'dialog-topButton'}>
                                    { hasCloseXButton && 
                                        <Icon
                                            disabled={ false }
                                            className={'dialog-button dialog-button-close'}
                                            onClick={ onDismiss } 
                                            iconName={IconName.Delete}/>
                                    }
                                </div>
                            </div>
                            <div className={'dialog-inner'}>
                                <div className={ classNames('dialog-content', this.props.contentClassName) }>
                                    { subTextContent }
                                    { groupings.contents }
                                </div>
                                { groupings.footers }
                            </div>
                        </div>
                    </div>    
                </Popup>
            </Layer>
        );
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
