/* eslint-disable simple-import-sort/imports */
import { Grid } from '@mui/material';
import { FC } from 'react';
import { KPI } from 'types/global';
import KPIMetrics from './KPIMetrics';

interface KPIRowProps {
  kpis: KPI[];
  justifyContent?: 'flex-end' | 'flex-start' | 'center' | 'space-between' | 'space-around';
  gap?: number;
}

const KPIRow: FC<KPIRowProps> = ({ kpis, ...props }) => {
  return (
    <Grid container mt={0} id="kpi-row" spacing={0} {...props}>
      {kpis.map((kpi) => (
        <Grid item xs="auto" spacing={0} key={kpi.id}>
          <KPIMetrics kpi={kpi} />
        </Grid>
      ))}
    </Grid>
  );
};

KPIRow.defaultProps = {
  justifyContent: 'flex-end',
  gap: 1
};

export default KPIRow;
