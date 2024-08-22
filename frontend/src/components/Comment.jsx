// src/components/Comment.jsx
import React from 'react';
import './Comment.css';

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <strong>{comment.user}</strong> 
      <p>{comment.content}</p>
    </div>
  );
};

export default Comment;
