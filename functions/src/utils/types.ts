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

export interface AggregatedData {
  updateSetup: (statement: StatementUpload) => void;
  aggregatedSum: SumTypesWithCount;
  monthlySum: Record<string, SumTypesWithCount>;
  yearlySum: Record<string, SumTypesWithCount>;
}

export type AggregatedDataArgs = {
  uid: string;
  accountId: string;
  aggregatedData: AggregatedData;
};

export type SumTypesWithCount = SumTypes & { count: number };
