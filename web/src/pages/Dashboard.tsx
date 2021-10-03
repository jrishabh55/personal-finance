import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { useAuthContext } from 'contexts/AuthContext';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { ChangeEventHandler, FC, useState } from 'react';

const Input = styled('input')({
  display: 'none'
});
export const Dashboard: FC = () => {
  const [status, setStatus] = useState<'uploading' | 'uploaded' | 'failed'>();
  const [auth] = useAuthContext();

  const handleClick: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setStatus('uploading');
    if (target.files?.length) {
      const file = target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `statements/${auth.user?.uid}/${Date.now()}-${file.name}`);
      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, file)
        .then(() => {
          console.log('Uploaded a blob or file!');
          setStatus('uploaded');
        })
        .catch((error) => {
          console.error(error);
          setStatus('failed');
        });
    }
  };

  return (
    <Grid
      container
      classes={{ root: 'w-screen h-screen' }}
      justifyContent="flex-end"
      alignItems="flex-start">
      <Box alignItems="flex-end" display="flex" flexDirection="column">
        <label htmlFor="contained-button-file">
          <Input
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            id="contained-button-file"
            type="file"
            onChange={handleClick}
          />
          <Button variant="contained" component="span" disabled={!!status}>
            {status === 'uploading' ? 'Uploading' : 'Upload'}
          </Button>
        </label>
        {status === 'uploaded' && <Alert severity="success">File uploaded successfully!</Alert>}
        {status !== 'failed' && <Alert severity="error">File uploaded successfully failed!</Alert>}
      </Box>
    </Grid>
  );
};
