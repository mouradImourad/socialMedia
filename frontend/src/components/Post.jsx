// src/components/Post.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Post.css';

const Post = ({ post }) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLike = () => {
    const url = liked ? `/api/v1/posts/${post.id}/unlike` : `/api/v1/posts/${post.id}/like`;

    axios.post(url)
      .then(() => {
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      })
      .catch(error => {
        console.error('Error liking/unliking post:', error);
      });
  };

  return (
    <div className="post">
      <p>{post.content}</p>
      {post.image && <img src={post.image} alt="Post" />}
      <div className="post-actions">
        <button onClick={handleLike}>
          {liked ? 'Unlike' : 'Like'} ({likesCount})
        </button>
        <button>Comment</button>
        <button>Share</button>
      </div>
    </div>
  );
};

export default Post;
