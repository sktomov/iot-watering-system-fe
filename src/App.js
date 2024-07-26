import React, { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Dashboard from './Dashboard';
import Auth from './Auth';
import UserMenu from './UserMenu'; // Нов компонент
import theme from './theme';

const App = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        {user ? (
          <>
            <UserMenu user={user} />
            <Dashboard />
          </>
        ) : (
          <Auth />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
