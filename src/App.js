import React, { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Typography } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Dashboard from './Dashboard';
import Auth from './Auth';
import UserMenu from './UserMenu'; // Нов компонент
import theme from './theme';

const allowedUsers = process.env.REACT_APP_ALLOWED_USERS.split(',');

const App = () => {
  const [user, setUser] = useState(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAllowed(allowedUsers.includes(user.email));
      } else {
        setUser(null);
        setIsAllowed(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        {user ? (
          isAllowed ? (
            <>
              <UserMenu user={user} />
              <Dashboard />
            </>
          ) : (
            <Typography variant="h6" color="error" align="center">
              Access Denied
            </Typography>
          )
        ) : (
          <Auth />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
