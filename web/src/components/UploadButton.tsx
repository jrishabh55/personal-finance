import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { useAuthContext } from 'contexts/AuthContext';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { ChangeEventHandler, FC, useState } from 'react';
import { uploadFile } from 'utils/uploadFile';

const Input = styled('input')({
  display: 'none'
});

const UploadButton: FC = () => {
  const [status, setStatus] = useState<'uploading' | 'uploaded' | 'failed'>();
  const [auth] = useAuthContext();

  const handleClick: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setStatus('uploading');
    if (target.files?.length) {
      const file = target.files[0];
      uploadFile({ file, uri: `statements/${auth.user?.uid}/${Date.now()}-${file.name}` })
        .then((fileRef) => {
          console.log('File Uploaded');
          const db = getFirestore();
          const col = collection(db, `files`);
          addDoc(col, {
            name: fileRef.metadata.name,
            path: fileRef.metadata.fullPath,
            uid: auth.user?.uid as string,
            accountId: 'uPXpnGOrD4k6UH3bYxYe',
            parsed: false
          }).finally(() => {
            console.log('Doc created!');
            setStatus('uploaded');
          });
        })
        .catch((error) => {
          console.error(error);
          setStatus('failed');
        })
        .finally(() => {
          setTimeout(setStatus, 5000, null);
        });
    }
  };

  return (
    <Box m={2} alignItems="flex-end" display="flex" flexDirection="column">
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
      {status === 'failed' && <Alert severity="error">File uploaded successfully failed!</Alert>}
    </Box>
  );
};

export default UploadButton;
