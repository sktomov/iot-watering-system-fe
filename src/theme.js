import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0', // Лилав основен цвят
    },
    secondary: {
      main: '#f50057', // Вторичен цвят, може да е розов
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          margin: '20px 0',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 50%, #9c27b0 100%)',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
  },
});

export default theme;
