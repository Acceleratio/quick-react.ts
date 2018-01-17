import * as React from 'react';
import { TreeviewItemHoverBtn } from '../Treeview/treeviewItemHoverBtn';
import { IHoverOverBtn } from '../Treeview';
import './HoverableButton.scss';
import { Tooltip } from '../../index';

export interface IHoverableButtonsProps {
    item: any;
    hoverOverBtn: Array<IHoverOverBtn>;
}

export interface IHoverableButtonsState {
    hover: boolean;
}

const addHoverableButtons = (hoverableProps: IHoverableButtonsProps) => <P extends {} >( Comp: React.ComponentClass<P> | React.StatelessComponent<P>): React.ComponentClass<P> => {
    return class HoverableButtons extends React.Component<P, IHoverableButtonsState> {
        public constructor(props: P) {
            super(props);
     
            this.state = {
                hover: false
            };
        }
    
        render(): JSX.Element {
            if (!hoverableProps.hoverOverBtn) {
                return <Comp {...this.props} />;
            }

            return <span className="hoverable-items__container" onMouseEnter={this._onItemHover.bind(this)} onMouseLeave={this._onItemLeaveHover.bind(this)}>
                <span className="hoverable-items__component">
                    <Comp {...this.props} />
                </span>
                
                {hoverableProps.hoverOverBtn && this.state.hover &&
                    <span className="hoverable-items-container__btn">
                        {
                            hoverableProps.hoverOverBtn.map((btn, keyNumber) => this._setButton(btn, keyNumber)
                            )
                        }
                    </span>}
            </span>; 
        }

        private _setButton(btn: IHoverOverBtn, keyNumber: number) {
            const hoverBtn = <TreeviewItemHoverBtn
                                key={keyNumber}
                                id={hoverableProps.item}
                                iconName={btn.iconName}
                                onClick={btn.callback}
                                className="hoverable-items__btn"
                            />;
            return  btn.tooltip !== undefined ? <Tooltip {...btn.tooltip}> {hoverBtn} </Tooltip> : hoverBtn;
        }

        private _onItemHover() {
            this.setState({
                hover: true
            });
        }

        private _onItemLeaveHover() {
            this.setState({
                hover: false
            });
        }
    };
  };

export default addHoverableButtons;
