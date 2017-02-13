import * as React from 'react';
import * as d3 from 'd3';

import { Label } from '../Label/Label';
import { IChartProps } from './LineChart.props';

import './LineChart.scss';

export type DataType = {time: Date, value: number};

export class LineChart extends React.Component<IChartProps, undefined> {

    private _focus: any;
    private margin: any = {
        top: 20,
        bottom: 20,
        left: 50,
        right: 40
    };

    private width: number = this.props.width - this.margin.left - this.margin.right;
    private height: number = this.props.height - this.margin.top - this.margin.bottom;
    private _x = this.generateX();
    private _y = this.generateY();
    
    TRANSFORM_SUBCONTAINER : string = 'translate(' + this.margin.left + ',' + this.margin.top + ')';
    GRAPH_CONTAINER_CLASS: string = 'graph-container';
    LINE_CLASS: string = 'graph-line';
    TRANSLATE_WIDTH: number = 10;
    TRANSFORM_X_AXIS: string = 'translate(0,' + (this.height) + ')';
    TRANSLATE_LINE: string = 'translate(' + this.TRANSLATE_WIDTH + ', 0)';

    refs: {
        [key: string]: (Element);
        container: (HTMLInputElement);
    }; 

    bisect =  d3.bisector<DataType, any>((d) => d.time).left;

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
            <div className={'component-container'}>
                <Label className={'graph-title'}>{this.props.title}</Label>
                <div className={'chart-container'} ref="container"></div>
            </div>
        );
    }

    private redraw() {
        let context = d3.select('.' + this.LINE_CLASS);
        context.remove();
        context = d3.select('.x-axis');
        context.remove();
        this.redrawGraph();
    }

    private draw() {
        const svg = this.createContainer();
        this.drawXAxis(svg);
        this.drawYAxis(svg);
        this.drawCaptureArea(svg);
        this.drawLine(svg);
        this.drawCircle(svg);
    }

    private redrawGraph() {
        const svg = d3.select('.graph-container');
        this.drawXAxis(svg);
        this.drawLine(svg);
    }

    private drawXAxis(svg: any) : void {
        svg.append('g')
            .attr('transform', this.TRANSFORM_X_AXIS)
            .attr('class', 'x-axis').call(this.generateXAxis());
    }

    private drawYAxis(svg: any) : void {
        svg.append('g').call(this.generateYAxis());
    }

    private drawLine(svg: any) {
        return (this.createLineSvg(svg).append('path')
            .data([this.props.data])
            .attr('class', this.LINE_CLASS)
            .attr('d', this.constructLine()));
    }

    private createContainer() {
        return (d3.select(this.refs.container).append('svg').attr('id', 'graph')
                .attr('width', this.props.width)
                .attr('height', this.props.height)
                .append('g').attr('class', this.GRAPH_CONTAINER_CLASS)
                .attr('transform', this.TRANSFORM_SUBCONTAINER));        
    }

    private generateX() {
        return (d3.scaleTime()
                .domain(d3.extent(this.props.data, (d) => d.time))
                .range([0, this.width]));
    }

    private generateY() {
        return (d3.scaleLinear()
                .domain([0, 1])
                .range([this.height, 0]));
    }

    private generateXAxis() {
        return (d3.axisBottom(this.generateX())
                .tickValues(d3.extent(this.props.data, (d) => d.time))
                .tickSizeInner(-(this.height))
                .tickSizeOuter(0).ticks(2, '%I:%M:%S %p')
                .tickPadding(10));        
    }

    private generateYAxis() {
        return (d3.axisLeft(this.generateY())
                .tickSizeInner(-(this.width))
                .tickSizeOuter(0)
                .ticks(2, '.0%')
                .tickPadding(10));   
    }

    private constructLine() {
        const x = this._x;
        const y = this._y;
        
        return (d3.line<DataType>()
                    .x((d) => x(d.time))
                    .y((d) => y(d.value))
                    .curve(d3.curveCatmullRom.alpha(0.5)));
    }

    private createFocus(svg: any) {
        this._focus =  svg.append('g').style('display', 'none');
        return this._focus;
    }

    private createLineSvg(svg: any) {
        return svg.append('g');
    }

    private drawCircle(svg: any) {
        return (this.createFocus(svg)
            .append('circle') 
            .attr('class', 'y')
            .style('fill', 'none') 
            .style('stroke', 'blue')
            .attr('r', 4));
    }

    private drawCaptureArea(svg: any) {
        return (svg.append('rect')
                    .attr('width', this.width)
                    .attr('height', this.height)
                    .style('fill', 'none')
                    .style('pointer-events', 'all')
                    .on('mouseover', () => this._focus.style('display', null))
                    .on('mouseout', () =>  this._focus.style('display', 'none'))
                    .on('mousemove', () => this.mouseMove()));
    }

    private mouseMove() {
        const x = this.generateX();
        const y = this._y;

        let x0 = x.invert(d3.mouse(d3.event.currentTarget)[0]);

        let i = this.bisect(this.props.data, x0, 1);
        let d0 = this.props.data[i - 1];
        let d1 = this.props.data[i];

        let d = (x0.getTime() - d0.time.getTime()) > (d1.time.getTime() - x0.getTime()) ? d1 : d0;

        this._focus.select('circle.y').attr('transform',  'translate(' + x(d.time) + ',' +  y(d.value) + ')'); 
    }
}
