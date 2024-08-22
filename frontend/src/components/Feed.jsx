import React, { useEffect, useState } from "react";
import apiClient from "../utils/api";  // Import your API client
import './Feed.css';  // Import the CSS for feed

const Feed = () => {
  const [posts, setPosts] = useState([]);  // Initialize posts as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("posts/")  // Fetch posts from the backend
      .then((response) => {
        const data = response.data;
        if (data && Array.isArray(data.results)) {
          setPosts(data.results);  // Set the posts to the "results" array
        } else {
          console.error("Unexpected response format:", data);
        }
        setLoading(false);  // Stop loading once the data is fetched
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  // Function to extract the part of the email before the @
  const getUsername = (email) => {
    return email.split('@')[0];  // Split the email at the "@" and return the first part
  };

  // Format the timestamp into a readable date and time
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();  // Convert to a readable date-time format
  };

  if (loading) {
    return <div>Loading feed...</div>;
  }

  return (
    <div className="feed-container">
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="post-header">
              <h3 className="post-user">
                <span className="username-background">{getUsername(post.user)}'s post:</span>
              </h3>
              <span className="post-timestamp">{formatDate(post.created_at)}</span> {/* Timestamp here */}
            </div>
            <div className="post-content">
              <p>{post.content}</p>
              {post.image && <img src={post.image} alt="Post" className="post-image" />}
              {post.video && <video controls src={post.video} className="post-video" />}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
