import { ChartData as ChartDataProps } from 'chart.js';

export type ChartType = 'bar'; // 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar';

export type ChartData = ChartDataProps;

export interface ChartSettings {
  type: ChartType;
  data: ChartData;
}

export interface ChartProps extends ChartSettings {
  id: string;
}

export interface BarChartProps extends ChartProps {
  type: 'bar';
}
