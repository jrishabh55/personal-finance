import Grid from '@mui/material/Grid';
import Chart from 'charts';
import { ChartData } from 'charts/types';
import KPIRow from 'components/KPIRow';
import { useAuthContext } from 'contexts/AuthContext';
import numeral from 'numeral';
import { FC, useEffect, useState } from 'react';
import { KPI } from 'types/global';
import getAggregatedKpis from 'utils/getAggregatedKpis';

export const Dashboard: FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [data, setData] = useState<ChartData>();
  const [auth] = useAuthContext();

  useEffect(() => {
    getAggregatedKpis({ uid: auth.user?.uid, accountId: 'uPXpnGOrD4k6UH3bYxYe' }).then((res) => {
      const kpi = res.data();

      if (!kpi) {
        return;
      }

      setKpis([
        {
          id: 'total-deposit',
          value: numeral(kpi.totalDeposit).format('0.0a'),
          title: 'Overall Deposit'
        },
        {
          id: 'total-withdrawal',
          value: numeral(kpi.totalWithdrawal).format('0.0a'),
          title: 'Overall Expenditure'
        }
      ]);

      setData({
        labels: ['Withdrawal', 'Deposit'],
        datasets: [
          {
            label: 'Overall Expenses',
            data: [kpi.totalWithdrawal, kpi.totalDeposit]
          }
        ]
      });
    });
  }, [auth.user]);

  return (
    <Grid container justifyContent="flex-end" spacing={0}>
      <Grid item xs="auto">
        <KPIRow kpis={kpis} />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={0}>
          <Grid item xs={3} justifyContent="flex-start" alignItems="flex-start">
            {data && <Chart id="bar-chart" type="bar" data={data} />}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
