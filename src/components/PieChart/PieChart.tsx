import * as React from 'react';
import * as d3 from 'd3';
import * as classNames from 'classnames';
import { IPieChartProps, IPieChartData } from './PieChart.props';
import { PieChartContent } from './PieChartContent';
import './PieChart.scss';

const objectAssign = require('object-assign');
const ResizeSensor = require('css-element-queries/src/ResizeSensor');

export class PieChart extends React.PureComponent<IPieChartProps, any> {
    public static defaultProps = {
        title: '',
        text: '',
        colors: d3.schemeCategory20,
        tipText: (data: IPieChartData) => data.label + ' : ' + data.value,
        showLegend: false
    };

    private containerRef : HTMLDivElement;
    private legendWidth : number;

    constructor(props: IPieChartProps) {
        super(props);

        this.state = {
            chartWidth: 0,
            chartHeight: 0,
            isParentMounted: false
        };
    }

    /**
     * Function that returns color based on given string.
     */
    private createColorPallette = () => d3.scaleOrdinal(this.props.colors);

    public render() {
        const pieComponentClass = classNames('pie-chart-component', this.props.id);
        
        const props = objectAssign({}, 
            {
                width: this.state.chartWidth, 
                height: this.state.chartHeight, 
                data: this.transformData(),
                id: this.props.id,
                colors: this.props.colors,
                tipText: this.props.tipText
            }
        );
        
        return (
            <div className={pieComponentClass}
                style={{width: this.props.dimensions.width, height: this.props.dimensions.height}}
                ref={(element: HTMLDivElement) => this.init(element)}>
                    { this.state.isParentMounted && <PieChartContent {...props}/>}
                    { this.props.showLegend && this.renderLegend(props.data) }
            </div>
        );
    }

    /**
     * Initialize width and height of component. This method gets invoked when
     * parent div component is mounted.
     */
    private init(element: HTMLDivElement): void {
        if (element === null) { return; }

        // get width and height of component container
        const width = element.offsetWidth;
        const height = element.offsetHeight;

        this.containerRef = element;
        
        let chartWidth = 0;

        // first rendering
        if ( this.state.isParentMounted === false ) {
            this.containerRef = element;
            const sensor = new ResizeSensor(element, () => this.onResize());
            this.setState({ chartWidth: width, chartHeight: height, isParentMounted: true });
            return;
        }

        this.setDimensions(width, height);
    }

    /**
     * Creates legend for chart based on given data.
     */
    private renderLegend(data: Array<IPieChartData>) : JSX.Element {
        const legendClass = classNames('pie-chart-legend', this.props.id);
        const color = this.createColorPallette();
        const legend = data.map(
            (d: IPieChartData, index: number) =>
                <div key={index} className={'legend-item'}>
                    <div style={{backgroundColor: color(d.label)}}/>
                    <label style={{display: 'inline-block'}}>{d.label}</label>
                </div> 
        );
        return <div className={legendClass}>{legend}</div>;
    }

    /**
     * If props for number of data is specified this function transforms given data so first n-1 
     * elements are shown in descending order and all other elements are displayed together
     * as one value.
     */
     private transformData(): Array<any> {


        const sortedData = this.props.data.sort((a, b) => b.value - a.value);

        if (this.props.displayingElements !== undefined && this.props.displayingElements < sortedData.length) {

            let data = Array(0);
            let elementsToTake = this.props.displayingElements - 1;
            if (elementsToTake === sortedData.length - 1) {
                elementsToTake --;
            }
            
            for (let i = 0; i < elementsToTake; i++) {
                data.push(sortedData[i]);
            }

            let value = 0;            
            for (let i = elementsToTake; i < sortedData.length; i++) {
                value += sortedData[i].value;            
            }            
            data.push({ label: 'Other', value: value });            
            
            return data;
        }

        return sortedData;
    }

    /**
     * Rescales component to new size base od parent component.
     */
    private onResize(): void {
        this.setDimensions(this.containerRef.offsetWidth, this.containerRef.offsetHeight);
    }

    private setDimensions(width: number, height: number): void {
        let chartWidth = 0;
        if ( !this.props.showLegend ) {
            chartWidth = width;
        } else {
            this.legendWidth = this.containerRef.children[1].getBoundingClientRect().width;
            if (width - 10 < this.legendWidth) { chartWidth = width; } else { chartWidth = width - this.legendWidth - 10; }
        }

        if (chartWidth >= height) { chartWidth = height; }

        if (this.state.chartWidth !== chartWidth || this.state.chartHeight !== height) {
            this.setState({ chartWidth: chartWidth, chartHeight: height, isParentMounted: true });
        }
    }

    public componentWillUnmount() { ResizeSensor.detach(this.containerRef); }
}
