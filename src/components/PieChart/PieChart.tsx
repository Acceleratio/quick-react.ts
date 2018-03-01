import * as React from 'react';
import * as d3 from 'd3';
import * as classNames from 'classnames';
import { IPieChartProps, IPieChartData } from './PieChart.props';
import { PieChartContent } from './PieChartContent';
import './PieChart.scss';

const resizeSensor = require('css-element-queries/src/ResizeSensor');
const guid = require('guid');

export class PieChart extends React.PureComponent<IPieChartProps, any> {
    public static defaultProps = {
        title: '',
        text: '',
        colors: d3.schemeCategory10,
        tipText: (data: IPieChartData) => data.label + ' : ' + data.value,
        showLegend: false
    };

    private containerRef: HTMLDivElement;

    constructor(props: IPieChartProps) {
        super(props);

        this.state = {
            chartWidth: 0,
            chartHeight: 0,
            isParentMounted: false,
            chartId: 'pie-' + guid.raw()
        };
    }

    /**
     * Function that returns color based on given string.
     */
    private createColorPallette = () => d3.scaleOrdinal(this.props.colors);

    public render() {
        const pieComponentClass = classNames('pie-chart-component', this.state.chartId);

        const props = {
            width: this.state.chartWidth,
            height: this.state.chartHeight,
            data: this.transformData(),
            id: this.state.chartId,
            colors: this.props.colors,
            tipText: this.props.tipText,
            tooltipBorderColor: this.props.tooltipBorderColor
        };

        return (
            <div className={pieComponentClass}
                style={{ width: this.props.dimensions.width, height: this.props.dimensions.height }}
                ref={(element: HTMLDivElement) => this.init(element)}>
                {this.state.isParentMounted && <PieChartContent {...props} />}
                {this.props.showLegend && this.renderLegend(props.data)}
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
        if (this.state.isParentMounted === false) {
            this.containerRef = element;
            const sensor = new resizeSensor(element, () => this.onResize());
            this.setState({ chartWidth: width, chartHeight: height, isParentMounted: true });
            return;
        }

        this.setDimensions(width, height);
    }

    /**
     * Creates legend for chart based on given data.
     */
    private renderLegend(data: Array<IPieChartData>): JSX.Element {
        const legendClass = classNames('pie-chart-legend', this.state.chartId);
        const color = this.createColorPallette();
        const legend = data.map(
            (chartData: IPieChartData, index: number) =>
                <div key={index} className={'legend-item'}>
                    <div style={{ backgroundColor: color(chartData.label) }} />
                    <label style={{ display: 'inline-block' }}>
                        {chartData.label}({chartData.value})
                    </label>
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
        let chartData = this.props.data;
        if (this.props.sortValues) {
            chartData = this.props.data.sort((a, b) => b.value - a.value);
        }

        if (this.props.displayingElements !== undefined && this.props.displayingElements < chartData.length) {

            let data = Array(0);
            let elementsToTake = this.props.displayingElements - 1;
            if (elementsToTake === chartData.length - 1) {
                elementsToTake--;
            }

            for (let i = 0; i < elementsToTake; i++) {
                data.push(chartData[i]);
            }

            let value = 0;
            for (let i = elementsToTake; i < chartData.length; i++) {
                value += chartData[i].value;
            }
            data.push({ label: 'Other', value: value });

            return data;
        }

        return chartData;
    }

    /**
     * Rescales component to new size base od parent component.
     */
    private onResize(): void {
        this.setDimensions(this.containerRef.offsetWidth, this.containerRef.offsetHeight);
    }

    private setDimensions(width: number, height: number): void {
        if (this.props.showLegend) {
            const legendHeight = this.containerRef.children[1].getBoundingClientRect().height;
            this.setState({ chartWidth: width, chartHeight: height - legendHeight, isParentMounted: true });
        } else {
            this.setState({ chartWidth: width, chartHeight: height, isParentMounted: true });
        }
    }

    public componentWillUnmount() { resizeSensor.detach(this.containerRef); }
}
