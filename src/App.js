import React from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import Dashboard from './Dashboard';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Dashboard />
      </Container>
    </ThemeProvider>
  );
}

export default App;
