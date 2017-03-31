import * as React from 'react';
import * as d3 from 'd3';
import * as classNames from 'classnames';
import { Label } from '../Label/Label';
import { IProgressBarProps } from './ProgressBar.props';
import { Tooltip } from '../Tooltip/Tooltip';
import './ProgressBar.scss';

const resizeSensor = require('css-element-queries/src/ResizeSensor');
const PERCENTAGE_LABEL_SIZE = 45;

export class ProgressBar extends React.Component<IProgressBarProps, any> {

    public static defaultProps = {
        info: '',
        progressColor: '#6699CC',
        showTooltip: false
    };

    private containerRef: HTMLDivElement;
    private labelHeight: number;

    constructor(props: IProgressBarProps) {
        super(props);

        this.state = {
            isParentMounted: false,
            width: 0,
            height: 0,
            tipX: 0,
            tipY: 0,
            tipText: '',
            isTipVisible: false
        };
    }

    public render() {
        const className = classNames('progress-bar-component', this.props.id);
        const bar = this.scaleBar();
        return (
            <div style={this.props.dimensions} className={className} ref={(element: HTMLDivElement) => this.init(element)}>
                <Label>{this.props.title}</Label>
                { this.state.isParentMounted && 
                    <svg width={this.state.width} height={this.state.height}>
                        <g>
                            <rect className={'progress-baseline'} height={this.state.height} width={this.state.width} fill={'lightgrey'}/>
                            <rect 
                                className={'progress-current'} 
                                height={this.state.height}
                                fill={this.props.progressColor}
                                width={bar(this.props.data.current)}
                            />
                            <rect
                                width={this.state.width}
                                height={this.state.height}
                                fill={'transparent'}
                                onMouseOver={(event: React.MouseEvent<SVGRectElement>) => this.showTooltip(event.currentTarget)}
                                onMouseOut={() => this.hideTooltip()}
                                cursor={'pointer'}
                            />
                        </g>
                        { this.props.showTooltip && 
                            <Tooltip id={'progress-bar-tooltip'} x={this.state.tipX} y={this.state.tipY} text={this.state.tipText} visible={this.state.isTipVisible} />
                        }
                    </svg>
                }
                <Label className={classNames('percentage-label', this.props.id)} width={40}>{this.calculatePercentage()}</Label>
            </div>
        );
    }

    private showTooltip(element: SVGRectElement) {
        const x = this.state.width / 2;
        const y = this.state.height / 2;
        this.setState({ isTipVisible: true, tipText: this.props.info, tipX: x, tipY: y });
    }

    private hideTooltip() {
        this.setState({ isTipVisible: false });
    }

    private init(element: HTMLDivElement) {
        if (element === null) { return; }
        this.containerRef = element;
        if (!this.state.isParentMounted) {
            const sensor = new resizeSensor(element, () => this.onResize());
        }
        const dimensions = element.getBoundingClientRect();
        const width = dimensions.width - PERCENTAGE_LABEL_SIZE;
        const height = dimensions.height;
        this.labelHeight = element.children[0].getBoundingClientRect().height;
        if (width !== this.state.width || (height - this.labelHeight) !== this.state.height) {
            this.setState({ width: width, height: height - this.labelHeight, isParentMounted: true });
        }
    }

    public componentWillUnmount() {
        resizeSensor.detach(this.containerRef);
    }

    private onResize() {
        const dimensions = this.containerRef.getBoundingClientRect();
        this.setState({ width: this.containerRef.offsetWidth, height: this.containerRef.offsetHeight - this.labelHeight });
    }

    private scaleBar() {
        return d3.scaleLinear().domain([0, this.props.data.total]).range([0, this.state.width]);
    }

    private calculatePercentage() : string {
        const percentage = Math.floor( (this.props.data.current / this.props.data.total) * 100 );
        return percentage.toString() + '%';
    }
}
