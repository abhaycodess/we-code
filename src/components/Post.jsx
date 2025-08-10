import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import { FavoriteBorder, ChatBubbleOutline, Share } from '@mui/icons-material';

const Post = ({ post }) => {
  const { username, avatar, content, image } = post;

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={<Avatar src={avatar} aria-label="recipe" />}
        title={username}
        subheader="September 14, 2022" // Placeholder for post timestamp
      />
      {image && (
        <CardMedia
          component="img"
          height="300"
          image={image}
          alt="Post image"
        />
      )}
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteBorder />
        </IconButton>
        <IconButton aria-label="comment">
          <ChatBubbleOutline />
        </IconButton>
        <IconButton aria-label="share">
          <Share />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Post;
