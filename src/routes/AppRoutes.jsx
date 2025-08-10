import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import UserHomePage from '../pages/UserHomePage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';

const AppRoutes = () => {
  // Placeholder for auth state. In a real app, you'd get this from Redux or context.
  const isLoggedIn = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout withSidebar={false} />}>
            <Route path="/" element={!isLoggedIn ? <LandingPage /> : <Navigate to="/home" />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/home" element={isLoggedIn ? <UserHomePage /> : <Navigate to="/login" />} />
          <Route path="/profile/:userId" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
