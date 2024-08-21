import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const Feed = ({ post, onDelete }) => {
  const [likesCount, setLikesCount] = useState(post.likes_count);  // Initialize state with the post's likes count
  const [isLiked, setIsLiked] = useState(post.is_liked_by_user);  // Track if the current user has liked the post
  const [showExtraModal, setShowExtraModal] = useState(false);

  const likePost = (id) => {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token);

    axios.put(`http://localhost:8000/api/v1/posts/${id}/like/`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Like post response:', response.data);
      if (response.data.message === "Post liked") {
        if (!isLiked) {
          setLikesCount(likesCount + 1);  // Increment the likes count
          setIsLiked(true);  // Update the liked status
        }
      } else if (response.data.message === "Post unliked") {
        if (isLiked) {
          setLikesCount(likesCount - 1);  // Decrement the likes count
          setIsLiked(false);  // Update the liked status
        }
      }
    })
    .catch(error => console.error("Error:", error));
  };

  const deletePost = () => {
    const token = localStorage.getItem('accessToken');
    axios.delete(`http://localhost:8000/api/v1/posts/${post.id}/delete/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      onDelete(post.id);  
    })
    .catch(error => console.error("Error:", error));
  };

  return (
    <div className="feed-container">
      <div className="flex items-center space-x-6">
        <img src={post.created_by.get_avatar} className="feed-img" alt="Avatar" />
        <p>
          <strong>
            <Link to={`/profile/${post.created_by.id}`}>{post.created_by.name}</Link>
          </strong>
        </p>
      </div>
      <p className="text-gray-600">{post.created_at_formatted} ago</p>

      {post.attachments.length > 0 && (
        post.attachments.map(image => (
          <img key={image.id} src={image.get_image} className="feed-post-img" alt="Post attachment" />
        ))
      )}

      <p>{post.body}</p>

      <div className="feed-extra-modal">
        <div className="feed-like" onClick={() => likePost(post.id)}>
          <span>{likesCount} likes</span>  {/* Update the displayed likes count */}
        </div>
        <div className="feed-comment-link">
          <Link to={`/postview/${post.id}`}>{post.comments_count} comments</Link>
        </div>
        {post.is_private && (
          <div className="feed-private">
            <span>Is private</span>
          </div>
        )}
        <div className="feed-button" onClick={() => setShowExtraModal(!showExtraModal)}>
          <span>⋮</span>
        </div>

        {showExtraModal && (
          <div className="feed-extra-modal">
            <div className="feed-extra-modal-delete" onClick={deletePost}>
              <span>Delete post</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
