export interface IPieChartProps {
    title: string;
    text: string;
    width: number;
    height: number;
    data: IPieChartData[];
    statusInterval?: IPieChartStatus[];
}

export interface IPieChartData {
    label: string;
    value: number;
    text?: string;
}

export interface IPieChartStatus {
    from: number;
    to: number;
    status: string; // ok, warning, critical
}
