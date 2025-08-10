import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams();
  return (
    <Typography variant="h2">Profile Page for user {userId}</Typography>
  );
};

export default ProfilePage;
