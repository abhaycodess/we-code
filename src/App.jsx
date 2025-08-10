import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeSettings } from './theme/theme.js';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  const { mode } = useSelector((state) => state.theme);
  const theme = React.useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
