// src/components/Feed.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
import './Feed.css';

const Feed = () => {
  // Initialize posts as an empty array
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/posts')
      .then(response => {
        // Ensure that the response is an array before setting it
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error('Unexpected response data format:', response.data);
          setPosts([]); // Set empty array if the response is not an array
        }
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setPosts([]); // Set empty array in case of an error
      });
  }, []);

  return (
    <div className="feed">
      {posts.length === 0 ? (
        <p>No posts available</p>  // Handle empty posts state
      ) : (
        posts.map(post => <Post key={post.id} post={post} />)
      )}
    </div>
  );
};

export default Feed;
