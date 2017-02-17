import * as React from 'react';
import * as d3 from 'd3';

import { Label } from '../Label/Label';
import { IChartProps } from './LineChart.props';

import './LineChart.scss';

export type DataType = {key: Date | number, value: number};

export class LineChart extends React.Component<IChartProps, undefined> {

    private _focus: any;
    private margin: any = {
        top: 20,
        bottom: 30,
        left: 50,
        right: 40
    };
    private width: number = this.props.width - this.margin.left - this.margin.right - 10;
    private height: number = this.props.height - this.margin.top - this.margin.bottom;
    private _y = this.generateY();
    
    GRAPH_CONTAINER_CLASS: string = 'graph-container';
    LINE_CLASS: string = 'graph-line';
    TRANSLATE_WIDTH: number = 10;
    TRANSFORM_X_AXIS: string = 'translate(0,' + (this.height) + ')';
    TRANSLATE_LINE: string = 'translate(' + this.TRANSLATE_WIDTH + ', 0)';

    refs: {
        [key: string]: (Element);
        container: (HTMLInputElement);
    };

    constructor(props: IChartProps) {
        super(props);
    }

    public componentDidMount() {
        this.draw();
    }

    public componentDidUpdate() {
        this.redraw();
    }

    public render() {
        return (
            <div className={'line-chart-container'} ref="container">
                {this.props.title}
            </div>
        );
    }

    private redraw() {
        d3.select('.' + this.LINE_CLASS).remove();
        d3.select('.x-axis').remove();

        const svg = d3.select('.' + this.GRAPH_CONTAINER_CLASS);
        this.drawXAxis(svg);
        this.drawLine(svg);
    }

    private draw() {
        const svg = this.createContainer();
        this.drawXAxis(svg);
        this.drawYAxis(svg);
        this.drawLine(svg);
        this.createFocus(svg);
        this.createDropShadow(svg);
        this.addTooltip();
        this.drawCaptureArea(svg);
    }

    private style(g: any) {
        g.selectAll('.tick').attr('stroke', 'white');
    }

    private drawXAxis(svg: any) : void {
        svg.insert('g', ':first-child')
            .attr('transform', this.TRANSFORM_X_AXIS)
            .attr('class', 'x-axis')
            .call(this.generateXAxis());
    }

    private drawYAxis(svg: any) : void {
        const g = svg.append('g')
                .attr('class', 'y-axis')
                .call(this.generateYAxis());
        g.selectAll('line').attr('transform', 'translate(-15, 0)');
    }

    private drawLine(svg: any) {
        return svg.insert('path', '.y-axis + *')
            .data([this.props.data])
            .attr('class', this.LINE_CLASS)
            .attr('d', this.constructLine());
    }

    private createContainer() {
        return d3.select(this.refs.container).append('svg')
                    .attr('width', this.props.width - 10)
                    .attr('height', this.props.height + 20)
                    .append('g')
                    .attr('class', this.GRAPH_CONTAINER_CLASS)
                    .attr('transform', 'translate(' + this.margin.left + ',' + (this.margin.top + 20) + ')');        
    }

    private createDropShadow(svg: any) {
        let defs = svg.append('defs');

        let filter = defs.append('filter')
            .attr('id', 'drop-shadow')
            .attr('height', '120%');

        filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 5)
            .attr('result', 'blur');

        filter.append('feOffset')
            .attr('in', 'blur')
            .attr('dx', 2)
            .attr('dy', 2)
            .attr('result', 'offsetBlur');

        let feMerge = filter.append('feMerge');

        feMerge.append('feMergeNode')
            .attr('in', 'offsetBlur');
        feMerge.append('feMergeNode')
            .attr('in', 'SourceGraphic');
    }

    private generateX() : any {
        const domain = d3.extent(this.props.data, (d) => d.key);
        const range = d3.extent([0, this.width]);
        switch(this.props.xAxisScale) {
            case 'TIME':
                return d3.scaleTime().domain(domain).range(range);
            case 'LINEAR':
                return d3.scaleLinear().domain(domain).range(range);
            default:
                return null;
        }
    }

    private generateY() {
        return d3.scaleLinear()
                .domain([0, 100])
                .range([this.height, 0]);
    }

    private generateXAxis() {
        return d3.axisBottom(this.generateX())
                .tickValues(d3.extent(this.props.data, (d) => d.key))
                .tickSizeInner(-(this.height))
                .tickSizeOuter(0)
                .ticks(2, '%I:%M:%S %p')
                .tickPadding(15);        
    }

    private generateYAxis() {
        let ticks = 2;
        if (this.props.gridSize !== undefined) { ticks = this.props.gridSize; }
        return d3.axisLeft(this.generateY())
                .tickSizeInner(-(this.width + 15))
                .tickSizeOuter(-10)
                .ticks(ticks)
                .tickFormat((d) => (d + '%'))
                .tickPadding(20);   
    }

    private constructLine() {
        const x = this.generateX();
        return d3.line<DataType>()
                    .x((d) => x(d.key))
                    .y((d) => this._y(d.value));
    }

    private createFocus(svg: any) {
        this._focus =  svg.append('g').style('display', 'none');
        return this._focus;
    }

    private drawCaptureArea(svg: any) {
        return svg.append('rect')
                    .attr('width', this.width)
                    .attr('height', this.height)
                    .attr('class', 'line-chart-capture')
                    .style('fill', 'none')
                    .style('pointer-events', 'all')
                    .on('mouseover', () => this._focus.style('display', null))
                    .on('mouseout', () =>  this._focus.style('display', 'none'))
                    .on('mousemove', () => this.mouseMove());
    }

    private addTooltip() {
        this._focus.append('rect')
            .attr('width', '40')
            .attr('height', '24')
            .attr('class', 'tip-rect')
            .attr('display', 'none')
            .style('filter', 'url(#drop-shadow)')
            .attr('fill', 'white');

        this._focus.append('polygon')
            .attr('fill', 'white')
            .attr('class', 'tip-pol')
            .style('filter', 'url(#drop-shadow)')
            .attr('points', '10,20 20,35 30,20');

        this._focus.append('text')
            .attr('class', 'tooltip-text')
            .attr('dx', 8)
            .attr('dy', '-.3em');
    }

    private mouseMove() {
        const x = this.generateX();
        const bisect = d3.bisector<DataType, any>((d) => d.key).left;

        let x0 = x.invert(d3.mouse(d3.event.currentTarget)[0]);

        let i = bisect(this.props.data, x0, 1);
        let d0 = this.props.data[i - 1];
        let d1 = this.props.data[i];

        let d;

        if (this.props.xAxisScale === 'TIME') {
            d = (x0.getTime() - (d0.key as Date).getTime()) > ((d1.key as Date).getTime() - x0.getTime()) ? d1 : d0;
        }

        d = x0 - (d0.key as any) > (d1.key as any) - x0 ? d1 : d0;

        this._focus.select('.tip-rect')
                .attr('transform', 'translate(' + (x(d.key) - 20) + ',' + (this._y(d.value) - 40) + ')')
                .attr('display', 'block');
        this._focus.select('.tip-pol')
                .attr('transform', 'translate(' + (x(d.key) - 20) + ',' + (this._y(d.value) - 40) + ')');
        this._focus.select('text.tooltip-text')
                .attr('transform', 'translate(' + (x(d.key) - 24) + ',' + (this._y(d.value) - 20) + ')')
                .text(() => d.value + ' %');
    }
}
