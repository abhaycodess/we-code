import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', pt: 8, pb: 8 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Welcome to We-Code
        </Typography>
        <Typography variant="h5" component="p" color="text.secondary" paragraph>
          The social platform for developers to connect, collaborate, and code together.
          Share your projects, ask questions, and grow your network.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/signup"
          sx={{ mt: 4 }}
        >
          Get Started
        </Button>
    </Container>
  );
};

export default LandingPage;
