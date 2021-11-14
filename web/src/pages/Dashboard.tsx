import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import KPIRow from 'components/KPIRow';
import { useAuthContext } from 'contexts/AuthContext';
import numeral from 'numeral';
import { FC, useEffect, useState } from 'react';
import { KPI } from 'types/global';
import getAggregatedKpis from 'utils/getAggregatedKpis';

const Input = styled('input')({
  display: 'none'
});

export const Dashboard: FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [auth] = useAuthContext();

  useEffect(() => {
    getAggregatedKpis({ uid: auth.user?.uid, accountId: 'uPXpnGOrD4k6UH3bYxYe' }).then((res) => {
      const kpi = res.data();
      console.log('Calling', kpi);
      if (!kpi) {
        return;
      }

      setKpis(
        kpis.concat([
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
        ])
      );
    });
  }, [auth.user]);

  return (
    <Grid container justifyContent="flex-end" spacing={0}>
      <Grid item xs="auto">
        <KPIRow kpis={kpis} />
      </Grid>

      {/* <Grid item xs="auto">

      </Grid> */}
      <Grid item xs={12}>
        <Grid container spacing={0}>
          <Grid
            item
            xs={12}
            justifyContent="flex-start"
            alignItems="flex-start"
            classes={{ root: 'border-white' }}>
            <pre>{JSON.stringify(kpis, null, 2)}</pre>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
