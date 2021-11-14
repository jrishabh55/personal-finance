import { DocumentData } from 'firebase/firestore';

export interface KPI {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
}

export interface KPIData extends DocumentData {
  totalDeposit: number;
  totalWithdrawal: number;
  type: 'overall' | 'month' | 'year';
}

export interface OverallKPIData extends KPIData {
  type: 'overall';
}

export interface YearKPIData extends KPIData {
  month: string;
  type: 'year';
}

export interface MonthKPIData extends KPIData {
  month: string;
  year: string;
  type: 'month';
}
