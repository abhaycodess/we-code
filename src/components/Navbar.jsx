import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { toggleMode } from '../features/theme/themeSlice';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo/wecode-logo.svg';

const Navbar = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  // Placeholder for auth state
  const isLoggedIn = false;

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <img src={Logo} alt="We-Code Logo" style={{ height: 40, marginRight: 10 }} />
          We-Code
        </Typography>
        <Button color="inherit" component={Link} to="/about">About Us</Button>
        <Button color="inherit" component={Link} to="/blog">Blog</Button>
        <Button color="inherit" component={Link} to="/qa">Q&A</Button>
        {isLoggedIn ? (
          <>
            <IconButton onClick={() => dispatch(toggleMode())}>
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
