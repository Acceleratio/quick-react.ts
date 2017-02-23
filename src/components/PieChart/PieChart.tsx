import * as React from 'react';
import * as d3 from 'd3';
import * as classNames from 'classnames';
import { Label } from '../Label/Label';
import { IPieChartProps } from './PieChart.props';
import { IPieChartData } from './PieChart.props';

import './PieChart.scss';

export class PieChart extends React.Component<IPieChartProps, any> {

    refs: {
        [key: string]: (Element),
        container: HTMLInputElement
    };

    private margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };

    private _radius: any;
    private _focus: any;
    private _arc: any;
    private _textCoordinates: number[];

    constructor() {
        super();
    }

    componentDidMount() {
        this.draw();
    }

    componentDidUpdate() {
        this.redraw();
    }

    private redraw() {
        d3.select('.svg-container').remove();
        this.draw();
    }

    public render() {
        return (<div className={'pie-chart-component'}>
                    <Label className={'title'}>{this.props.title}</Label>
                    <Label className={'text'}>{this.props.text}</Label>
                    <div className={'pie-chart-container'} ref={'container'}></div>
                </div>);
    }

    private draw() {
        this._radius = (this.props.width - 2) / 4;
        const svg = this.createContainer();
        const pie = this.createPie();
        const arc = this.createArc();
        const color = this.createColorPallette();

        let g = svg.selectAll('.arc')
            .data(pie(this.props.data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        g.append('path').attr('d', (arc as any))
            .attr('class', (d) => (d.data.class) ? d.data.class : 'arc-path')
            .style('fill', (d) => color(d.data.label));

        g = svg.selectAll('.arc-text')
            .data(pie(this.props.data))
            .enter()
            .append('g')
            .attr('class', 'arc-text');

        g.append('text')
            .attr('transform',
            (d) => { 
                this._textCoordinates = arc.centroid(d); 
                return 'translate(' + arc.centroid(d) + ')'; 
            })
            .text((d) => {
                const unit = d.data.unit === undefined ? '' : d.data.unit;
                return d.data.value + ' ' + unit;
            })
            .style('font-size', (this._radius / 3))
            .attr('text-anchor', 'middle')
            .attr('class', 'percentage-label')
            .on('mouseover', (d) => this.showTooltip(d))
            .on('mouseout', () => this._focus.style('display', 'none'));

            this.createTooltip(svg);
    }

    private showTooltip(d: any) {
        const coordinates = this._arc.centroid(d);

        this._focus.style('display', 'block');

        this._focus.select('.tip-rect')
            .attr('transform',
            'translate(' + (coordinates[0] - this._radius * 1.5) + ',' + (coordinates[1] - this._radius * (3 / 2)) + ')');

        this._focus.select('.tip-pol')
            .attr('transform',
            'translate(' + (coordinates[0] - this._radius) + ',' + (coordinates[1] - this._radius * (3 / 2)) + ')');

        this._focus.select('text.tooltip-text')
            .attr('transform',
            'translate(' + (coordinates[0] - this._radius * 1.5) + ',' + (coordinates[1] - this._radius * (5 / 4)) + ')')
            .text(d.data.text);
    }

    private createContainer() {
        return d3.select(this.refs.container).append('svg')
            .attr('class', 'svg-container')
            .attr('width', this.props.width - 2)    // minus 2 because of border
            .attr('height', this.props.height - 20)
            .append('g')
            .attr('class', 'pie-chart-g')
            .attr('transform', 'translate(' + (this.props.width / 2) + ',' + (this.props.height / 2) + ')');
    }

    private createArc() {
        this._arc = d3.arc()
            .outerRadius(this._radius)
            .innerRadius(0);
        return this._arc;
    }

    private createFocus(svg: any) {
        return svg.append('g').style('display', 'none');
    }

    private createTooltip(container: any) {
        this._focus = this.createFocus(container);

        this._focus.append('rect')
            .attr('width', this._radius * 3)
            .attr('height', this._radius)
            .attr('class', 'tip-rect')
            .attr('fill', 'white')
            .attr('x', 0)
            .attr('y', 0);

        // Calculate position of tip pointer
        const middlePoint = this._radius; // width is 2 times of a radius
        const width = this._radius / 4;
        const leftPoint = middlePoint - width;
        const rightPoint = middlePoint + width;
        const tipHeight = this._radius * (5 / 4);
        const bottomPoint = this._radius - 2;

        const p1 = leftPoint + ',' + bottomPoint;
        const p2 = middlePoint + ',' + tipHeight;
        const p3 = rightPoint + ',' + bottomPoint;

        this._focus.append('polygon')
            .attr('fill', 'white')
            .attr('class', 'tip-pol')
            .attr('points', p1 + ' ' + p2 + ' ' + p3);

        this._focus.append('text')
            .attr('class', 'tooltip-text')
            .attr('fill', 'black')
            .attr('dx', this._radius * 1.5)
            .attr('dy', this._radius / 2)
            .attr('text-anchor', 'middle');
    }

    private createPie() {
        return d3.pie<IPieChartData>().sort(null).value((d): any => d.value);
    }

    private createColorPallette() {
        return d3.scaleOrdinal(d3.schemeCategory10);
    }

    private _checkNameLen(name: string) : string {
        if (name.length > 5) {
            if (name.indexOf('.') !== -1 && name.indexOf('.') < 5) {
                name = name.substr(0, name.indexOf('.') + 1);
            } else {
                name = name.substr(0, 2) + '...';
            }                
        }
        return name;
    }
}