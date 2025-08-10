import React from 'react';
import { Box, Container } from '@mui/material';
import StoryBar from '../components/StoryBar';
import Post from '../components/Post';

const posts = [
    {
      id: 1,
      username: 'Jules',
      avatar: `https://avatar.iran.liara.run/public/boy?username=jules`,
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      content: 'Just deployed a new feature for our app! Super excited to see how users respond. #react #development',
    },
    {
      id: 2,
      username: 'Alex',
      avatar: `https://avatar.iran.liara.run/public/girl?username=alex`,
      image: 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      content: 'Working on some cool new UI designs with Material-UI. The flexibility is amazing!',
    },
    {
        id: 3,
        username: 'Chris',
        avatar: `https://avatar.iran.liara.run/public/boy?username=chris`,
        content: 'Anyone have experience with GraphQL? Looking for some advice on how to structure my schemas.',
    }
  ];

const UserHomePage = () => {
  return (
    <Container maxWidth="md">
      <StoryBar />
      <Box sx={{ mt: 3 }}>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Box>
    </Container>
  );
};

export default UserHomePage;
