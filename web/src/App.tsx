import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from 'Routes';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  typography: {
    subtitle1: {
      lineHeight: 1
    },
    caption: {
      lineHeight: 1
    }
  }
});

const App: FC = () => {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default App;
