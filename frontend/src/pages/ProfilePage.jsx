import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');  // Get the user ID from localStorage

  // Fetch the user's posts
  useEffect(() => {
  const fetchPosts = async () => {
    const accessToken = localStorage.getItem('accessToken'); // Check access token

    // Log access token to verify it's present
    console.log("Access Token:", accessToken);

    if (!accessToken) {
      console.error('No access token found. User may not be logged in.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/posts/user/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,  // Pass the access token in the headers
          },
        }
      );
      setPosts(response.data.results);  // Assuming the API returns paginated results
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setLoading(false);
    }
  };

  fetchPosts();
}, [userId]);


  // Handle new post submission
  const handleNewPostSubmit = async (e) => {
    e.preventDefault();

    if (!newPostContent.trim()) {
      alert('Post content cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/posts/create/',  // Replace with your POST API endpoint
        {
          content: newPostContent,
          user: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      // Add the new post at the top of the post list
      setPosts([response.data, ...posts]);
      setNewPostContent('');  // Clear the new post input box
    } catch (error) {
      console.error('Error creating new post:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>

      {/* New Post Box */}
      <div className="new-post-box">
        <form onSubmit={handleNewPostSubmit}>
          <textarea
            className="new-post-input"
            placeholder="Write something..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button type="submit" className="submit-post-button">
            Post
          </button>
        </form>
      </div>

      {/* User's Previous Posts */}
      <div className="user-posts">
        <h3>Your Posts</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <p className="post-content">{post.content}</p>
              {/* Display the timestamp */}
              <p className="post-timestamp">
                Posted on {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>You haven't posted anything yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
