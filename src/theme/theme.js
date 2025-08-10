import { createTheme } from '@mui/material/styles';

export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
            primary: {
              main: '#003366',
            },
            secondary: {
              main: '#FFD700',
            },
            background: {
              default: '#f4f5f7',
              paper: '#ffffff',
            },
          }
        : {
            // palette values for dark mode
            primary: {
              main: '#66B2FF',
            },
            secondary: {
              main: '#FFD700',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
          }),
    },
    typography: {
      fontFamily: ['Inter', 'sans-serif'].join(','),
      h1: {
        fontFamily: ['Cormorant Garamond', 'serif'].join(','),
        fontSize: 40,
      },
      h2: {
        fontFamily: ['Cormorant Garamond', 'serif'].join(','),
        fontSize: 32,
      },
      h3: {
        fontFamily: ['Cormorant Garamond', 'serif'].join(','),
        fontSize: 24,
      },
      h4: {
        fontFamily: ['Cormorant Garamond', 'serif'].join(','),
        fontSize: 20,
      },
      h5: {
        fontFamily: ['Cormorant Garamond', 'serif'].join(','),
        fontSize: 16,
      },
      h6: {
        fontFamily: ['Cormorant Garamond', 'serif'].join(','),
        fontSize: 14,
      },
    },
  };
};
