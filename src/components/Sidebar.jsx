import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Avatar, Toolbar } from '@mui/material';
import { Home, Chat, AddCircleOutline, Settings, Menu as MenuIcon, ChevronLeft } from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Sidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const username = 'testuser'; // placeholder
  const boyPic = `https://avatar.iran.liara.run/public/boy?username=${username}`;

  return (
    <StyledDrawer variant="permanent" open={open}>
        <Toolbar />
        <List>
            <ListItemButton onClick={handleDrawerToggle}>
                <ListItemIcon>
                    {open ? <ChevronLeft /> : <MenuIcon />}
                </ListItemIcon>
            </ListItemButton>
            <ListItemButton component={Link} to="/">
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }}/>
            </ListItemButton>
            <ListItemButton component={Link} to="/chat">
            <ListItemIcon><Chat /></ListItemIcon>
            <ListItemText primary="Chat" sx={{ opacity: open ? 1 : 0 }}/>
            </ListItemButton>
            <ListItemButton component={Link} to="/create-post">
            <ListItemIcon><AddCircleOutline /></ListItemIcon>
            <ListItemText primary="Create Post" sx={{ opacity: open ? 1 : 0 }}/>
            </ListItemButton>
            <ListItemButton component={Link} to="/settings">
            <ListItemIcon><Settings /></ListItemIcon>
            <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }}/>
            </ListItemButton>
            <ListItemButton component={Link} to="/profile/me">
            <ListItemIcon>
                <Avatar src={boyPic} sx={{ width: 24, height: 24 }}/>
            </ListItemIcon>
            <ListItemText primary="Profile" sx={{ opacity: open ? 1 : 0 }}/>
            </ListItemButton>
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;
