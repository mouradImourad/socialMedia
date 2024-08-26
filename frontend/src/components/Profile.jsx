import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyNavbar from './MyNavbar';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    email: '',
    username: '',
    profile_picture: '',
    created_at: '',
    updated_at: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [userPosts, setUserPosts] = useState([]);  
  const [nextPage, setNextPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fileInputRef = useRef(null); // Add this reference
  const observer = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/users/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setProfileData(response.data);
        setNewUsername(response.data.username);
        fetchUserPosts(response.data.id, 1);  // Fetch the first page of posts
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setError('Error fetching profile data');
        }
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const fetchUserPosts = async (userId, page) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/posts/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        params: { page: page }
      });

      setUserPosts(prevPosts => [...prevPosts, ...response.data.results]);  // Append new posts to the list
      setHasMore(response.data.next !== null);  // Check if there are more pages
      setNextPage(page + 1);
    } catch (error) {
      setError('Error fetching user posts');
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('username', newUsername);
    if (newProfilePicture) {
      formData.append('profile_picture', newProfilePicture);
    }

    try {
      // Ensure Profile Update is Saved
      const response = await axios.patch('http://localhost:8000/api/v1/users/profile/update/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      console.log('Profile update response:', response.data); // Debugging: Check the response data

      // Refetch Profile Data After Update
      const profileResponse = await axios.get('http://localhost:8000/api/v1/users/profile/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setProfileData(profileResponse.data); // Update the profile data with the latest from the server

      alert('Profile updated successfully');
      setNewUsername('');
      setNewProfilePicture(null);
      fileInputRef.current.value = null;
    } catch (error) {
      setError('Error updating profile');
      console.error('Profile update error:', error); // Debugging: Log the error
    }
  };

  const handlePostCreation = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/v1/posts/create/', 
      {
        content: newPostContent
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setUserPosts([response.data, ...userPosts]); // Add the new post to the top of the list
      setNewPostContent(''); // Clear the post creation form
    } catch (error) {
      setError('Error creating post');
    }
  };

  const handleLikeUnlike = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/posts/${postId}/like/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      // Update the liked post in the state
      setUserPosts(userPosts.map(post => 
        post.id === postId ? { ...post, likes_count: post.likes_count + (response.data.message === 'Post liked' ? 1 : -1) } : post
      ));
    } catch (error) {
      setError('Error liking/unliking post');
    }
  };

  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchUserPosts(profileData.id, nextPage);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, nextPage, profileData.id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <>
      <MyNavbar />
      <div className="container mt-5">
        <div className="row">
          {/* Left Sidebar - Profile Picture and Update Form */}
          <div className="col-md-3">
            <div className="card shadow-sm mb-4">
              <div className="card-body text-center">
                <div className="mb-4">
                  <img
                    src={profileData.profile_picture || 'default-profile.png'}
                    alt="Profile"
                    className="rounded-circle img-fluid"
                    style={{ width: '150px', height: '150px', objectFit: 'cover', border: '5px solid #007bff' }}
                  />
                </div>
                <h2 className="card-title">{profileData.username}</h2>
                <p className="text-muted">{profileData.email}</p>
                <p>Joined: {new Date(profileData.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="mb-4 text-center">Edit Profile</h3>
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profile_picture" className="form-label">Profile Picture</label>
                    <input
                      type="file"
                      id="profile_picture"
                      name="profile_picture"
                      className="form-control"
                      ref={fileInputRef} // Add reference to the file input
                      onChange={(e) => setNewProfilePicture(e.target.files[0])}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Update Profile</button>
                </form>
              </div>
            </div>
          </div>

          {/* Middle Content Area - Post Creation and User Posts */}
          <div className="col-md-6">
            {/* Post Creation */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3 className="mb-4 text-center">Create Post</h3>
                <form onSubmit={handlePostCreation}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      placeholder="What's on your mind?"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      rows="4"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Post</button>
                </form>
              </div>
            </div>

            {/* User Posts */}
{userPosts.length > 0 ? (
  userPosts.map((post, index) => (
    <div
      key={`${post.id}-${index}`}  // Create a unique key
      className="card shadow-sm mb-4"
      style={{ height: '300px' }}
      ref={userPosts.length === index + 1 ? lastPostElementRef : null}
    >
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{post.user}</h5>
        <p className="card-text flex-grow-1 overflow-auto">{post.content}</p>
        {post.image && <img src={post.image} alt="Post" className="img-fluid rounded mt-2" />}
        {post.video && (
          <video controls className="img-fluid rounded mt-2">
            <source src={post.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <p className="text-muted mt-3">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
        <button className="btn btn-outline-primary" onClick={() => handleLikeUnlike(post.id)}>
          {post.likes_count} Like{post.likes_count !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  ))
) : (
  <p>No posts to display.</p>
)}


          </div>

          {/* Right Sidebar - Placeholder for future content */}
          <div className="col-md-3">
            {/* Future content can go here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
