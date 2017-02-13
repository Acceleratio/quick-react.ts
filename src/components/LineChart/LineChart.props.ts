export interface IChartProps {
    title: string;
    width: number;
    height: number;
    data: IChart[];
}

export interface IChart {
    time: Date;
    value: number;
}
