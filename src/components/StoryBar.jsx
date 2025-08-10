import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

const stories = [
  { username: 'john' },
  { username: 'jane' },
  { username: 'mike' },
  { username: 'sara' },
  { username: 'chris' },
  { username: 'lisa' },
  { username: 'david' },
  { username: 'emily' },
  { username: 'james' },
  { username: 'olivia' },
];

const StoryBar = () => {
  return (
    <Box sx={{ display: 'flex', overflowX: 'auto', p: 2, borderBottom: '1px solid #ddd' }}>
      {stories.map((story, index) => {
        const avatarUrl = index % 2 === 0
          ? `https://avatar.iran.liara.run/public/boy?username=${story.username}`
          : `https://avatar.iran.liara.run/public/girl?username=${story.username}`;
        return (
          <Box key={index} sx={{ textAlign: 'center', mr: 2 }}>
            <Avatar src={avatarUrl} sx={{ width: 60, height: 60, border: '2px solid #ccc' }} />
            <Typography variant="caption">{story.username}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default StoryBar;
