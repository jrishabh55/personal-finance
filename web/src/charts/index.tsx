/* eslint-disable simple-import-sort/imports */
import { Box } from '@mui/material';
import merge from 'lodash/merge';
import { FC, memo, useMemo } from 'react';
import { chartBorderColors, chartColors } from 'utils/color';
import Bar from './Bar';
import { ChartProps } from './types';

const defaultSettings = {
  width: 600,
  height: 700,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ]
  }
};

const defaultSeriesSetting = {
  borderWidth: 0,
  maxBarThickness: 50
};

const ComponentMap = {
  bar: Bar
};

const Chart: FC<ChartProps> = (props) => {
  const settings = useMemo(() => {
    const data = { ...props.data };
    data.datasets = data.datasets.map((dataset, index) => {
      return {
        backgroundColor: chartColors[index] || chartColors[0],
        borderColor: chartBorderColors[index] || chartBorderColors[0],
        ...defaultSeriesSetting,
        ...dataset
      };
    });

    return merge({ data }, defaultSettings, props);
  }, [props]);

  const Component = ComponentMap[props.type] as any;

  return (
    <Box m={0} p={0}>
      <Component {...settings} />
    </Box>
  );
};

export default memo(Chart);
