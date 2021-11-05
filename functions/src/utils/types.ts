import { Dayjs } from 'dayjs';

export interface StatementUpload {
  date: Dayjs;
  description: string;
  referenceId: string;
  amount: number;
  deposit: boolean;
}

export type SumTypes = {
  type: 'overall' | 'month' | 'year';
  month?: number;
  year?: number;
  deposit: number;
  withdrawal: number;
};

export type SumTypesWithCount = SumTypes & { count: number };
