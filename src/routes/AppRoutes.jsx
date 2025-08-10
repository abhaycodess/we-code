import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import UserHomePage from '../pages/UserHomePage';
import ProfilePage from '../pages/ProfilePage';
import Navbar from '../components/Navbar'; // Import Navbar
import { Box } from '@mui/material'; // Import Box for layout

function AppRoutes() {
  return (
    <Router>
      <Navbar /> {/* Render Navbar on all pages */}
      <Box sx={{ mt: '64px', p: 3 }}> {/* Add margin top to avoid content being hidden by Navbar */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<UserHomePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default AppRoutes;
