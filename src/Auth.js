import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from './firebaseConfig';

const Auth = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign-in error", error);
    }
  };

  const signInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.error("Facebook sign-in error", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Sign In
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={signInWithGoogle}
        fullWidth
        style={{ marginBottom: '10px' }}
      >
        Sign in with Google
      </Button>
      {/* <Button
        variant="contained"
        color="secondary"
        onClick={signInWithFacebook}
        fullWidth
      >
        Sign in with Facebook
      </Button> */}
    </Container>
  );
};

export default Auth;
