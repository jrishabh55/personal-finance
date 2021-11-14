import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';
import { KPI } from 'types/global';

interface KPIMetricsProps {
  kpi: KPI;
}

const KPIMetrics: FC<KPIMetricsProps> = ({ kpi }) => {
  return (
    <Box className="flex" p={1} boxShadow="inherit" borderColor="black" boxSizing="border-box">
      <Typography variant="subtitle1" align="right" component="p">
        {kpi.value}
      </Typography>
      <Typography variant="caption" align="right" component="span" color="primary" gutterBottom>
        {kpi.title}
      </Typography>
    </Box>
  );
};

export default KPIMetrics;
