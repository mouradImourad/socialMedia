// src/pages/PostDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from '../components/Post';
import Comment from '../components/Comment';  // Assuming you have a Comment component

const PostDetailsPage = () => {
  const { id } = useParams();  // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch the post details
    axios.get(`/api/v1/posts/${id}`)
      .then(response => setPost(response.data))
      .catch(error => console.error('Error fetching post:', error));

    // Fetch the comments for the post
    axios.get(`/api/v1/posts/${id}/comments`)
      .then(response => setComments(response.data))
      .catch(error => console.error('Error fetching comments:', error));
  }, [id]);

  return (
    <div className="post-details">
      {post && <Post post={post} />}
      <div className="comments-section">
        <h3>Comments</h3>
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default PostDetailsPage;
