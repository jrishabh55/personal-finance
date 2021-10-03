import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FC, useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';

export const Login: FC = () => {
  const firebaseAuth = useRef(getAuth());
  const auth = firebaseAuth.current;
  const history = useHistory();

  useEffect(() => {
    if (auth.currentUser) {
      history.replace('/dashboard');
    }
  }, [auth, history]);

  const handleLogin = useCallback(() => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }, [auth]);

  return (
    <Grid
      container
      spacing={2}
      classes={{ root: 'w-screen h-screen' }}
      justifyContent="center"
      alignItems="center">
      <Button variant="outlined" onClick={handleLogin}>
        Google
      </Button>
    </Grid>
  );
};
