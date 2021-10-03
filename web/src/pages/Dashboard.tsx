import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

const Input = styled('input')({
  display: 'none'
});
export const Dashboard: FC = () => {
  return (
    <Grid
      container
      classes={{ root: 'w-screen h-screen' }}
      justifyContent="flex-end"
      alignItems="flex-start">
      <label htmlFor="contained-button-file">
        <Input
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          id="contained-button-file"
          type="file"
        />
        <Button variant="contained" component="span">
          Upload
        </Button>
      </label>
    </Grid>
  );
};
