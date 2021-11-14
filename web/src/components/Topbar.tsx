/* eslint-disable simple-import-sort/imports */
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { FC } from 'react';
import UploadButton from './UploadButton';

const TopBar: FC = () => {
  // create a jsx material ui topbar
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="primary" component="span">
              R{' '}
            </Typography>
            Finance management
          </Typography>
          <UploadButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default TopBar;
