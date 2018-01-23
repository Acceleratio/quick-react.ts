import * as React from 'react';


export interface IQuickGridRowActionsHandler {

}


export class QuickGridRowActionsHandler extends React.PureComponent<IQuickGridRowActionsHandler, {}> {


    renderCount: number = 0;
    render() {
        this.renderCount++;
        return <span>{this.renderCount}</span>;
    }
}
