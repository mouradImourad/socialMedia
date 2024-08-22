// src/components/Post.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link
import axios from 'axios';
import './Post.css';

const Post = ({ post }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    axios.post(`/api/v1/posts/${post.id}/like`)
      .then(() => setLiked(!liked))
      .catch(error => console.error('Error liking the post:', error));
  };

  return (
    <div className="post">
      <Link to={`/post/${post.id}`}>
        <p>{post.content}</p>  {/* Clicking on the post content will navigate to Post Details */}
      </Link>
      {post.image && <img src={post.image} alt="Post" />}
      <div className="post-actions">
        <button onClick={handleLike}>{liked ? 'Unlike' : 'Like'}</button>
        <button>Comment</button>
        <button>Share</button>
      </div>
    </div>
  );
};

export default Post;
