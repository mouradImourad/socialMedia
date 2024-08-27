import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const PostList = ({ profileData }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [comments, setComments] = useState({}); // State for comments
  const [nextPage, setNextPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newCommentContent, setNewCommentContent] = useState(''); 
  const [commentError, setCommentError] = useState(''); 
  const [visibleComments, setVisibleComments] = useState({}); // State for toggling comments visibility
  const observer = useRef();
  const lastFetchTime = useRef(0);

  useEffect(() => {
    fetchUserPosts(profileData.id, 1);
  }, [profileData.id]);

  const fetchUserPosts = async (userId, page) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/posts/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        params: { page: page }
      });

      setUserPosts(prevPosts => [...prevPosts, ...response.data.results]);
      setHasMore(response.data.next !== null);
      setNextPage(page + 1);

      // Fetch comments for each post
      response.data.results.forEach(post => {
        fetchComments(post.id);
      });

    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/posts/${postId}/comments/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setComments(prevComments => ({
        ...prevComments,
        [postId]: response.data.results
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLikeUnlike = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/posts/${postId}/like/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setUserPosts(userPosts.map(post => 
        post.id === postId ? { ...post, likes_count: post.likes_count + (response.data.message === 'Post liked' ? 1 : -1) } : post
      ));
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handlePostDelete = async (postId, retries = 3) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/posts/${postId}/delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setUserPosts(userPosts.filter(post => post.id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      if (error.response && error.response.status === 429 && retries > 0) {
        setTimeout(() => handlePostDelete(postId, retries - 1), 1000);
      } else {
        console.error('Error deleting post. Please try again later.');
      }
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (newCommentContent.trim() === '') {
        setCommentError('Comment cannot be empty');
        return;
    }

    try {
        const response = await axios.post(`http://localhost:8000/api/v1/posts/${postId}/comment/`, 
        {
            content: newCommentContent
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        // Optionally, update the UI with the new comment
        setNewCommentContent('');
        setCommentError('');
        fetchComments(postId);  // Fetch the updated comments after submission
    } catch (error) {
        console.error('Error submitting comment:', error); // Log the error
        setCommentError('Error submitting comment');
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
    setCommentError('');
  };

  const lastPostElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchUserPosts(profileData.id, nextPage);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore, nextPage, profileData.id]);

  return (
    <>
      {userPosts.length > 0 ? (
        userPosts.map((post, index) => (
          <div
            key={`${post.id}-${index}`}
            className="card shadow-sm mb-4"
            style={{ height: 'auto' }}
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
              <div className="d-flex justify-content-between mt-2">
                <button className="btn btn-outline-primary" onClick={() => handleLikeUnlike(post.id)}>
                  {post.likes_count} Like{post.likes_count !== 1 ? 's' : ''}
                </button>
                <button className="btn btn-outline-danger" onClick={() => handlePostDelete(post.id)}>
                  Delete
                </button>
              </div>

              {/* Comment Section */}
              {visibleComments[post.id] && (
                <>
                  {comments[post.id] && comments[post.id].length > 0 && (
                    <div className="mb-3 mt-3">
                      <h6>Comments:</h6>
                      <ul className="list-group">
                        {comments[post.id].map(comment => (
                          <li key={comment.id} className="list-group-item">
                            <strong>{comment.user}</strong>: {comment.content}
                            <span className="text-muted float-end">{new Date(comment.created_at).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <textarea
                    className="form-control mt-3"
                    placeholder="Write a comment..."
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    rows="2"
                  ></textarea>
                  {commentError && <div className="text-danger mt-1">{commentError}</div>}
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => handleCommentSubmit(post.id)}
                  >
                    Submit Comment
                  </button>
                </>
              )}
              <button
                className="btn btn-outline-secondary mt-2"
                onClick={() => toggleCommentsVisibility(post.id)}
              >
                {visibleComments[post.id] ? "Hide Comments" : "Show Comments"}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No posts to display.</p>
      )}
    </>
  );
};

export default PostList;
