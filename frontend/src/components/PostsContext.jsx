import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [nextPage, setNextPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts(1); // Initial fetch for posts
  }, []);

  const fetchPosts = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/posts/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        params: { page }
      });

      setPosts(prevPosts => [...prevPosts, ...response.data.results]);
      setHasMore(response.data.next !== null);
      setNextPage(page + 1);

      // Fetch comments for each post
      response.data.results.forEach(post => {
        fetchComments(post.id);
      });
    } catch (error) {
      setError('Error fetching posts');
    } finally {
      setLoading(false);
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

  const addPost = async (content) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/posts/create/', 
      { content },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setPosts([response.data, ...posts]);
    } catch (error) {
      setError('Error creating post');
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/posts/${postId}/delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      setError('Error deleting post');
    }
  };

  const likeUnlikePost = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/posts/${postId}/like/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes_count: post.likes_count + (response.data.message === 'Post liked' ? 1 : -1) } : post
      ));
    } catch (error) {
      setError('Error liking/unliking post');
    }
  };

  const addComment = async (postId, content) => {
    if (content.trim() === '') {
      setError('Comment cannot be empty');
      return;
    }

    try {
      await axios.post(`http://localhost:8000/api/v1/posts/${postId}/comment/`, 
      { content },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      fetchComments(postId);
    } catch (error) {
      setError('Error submitting comment');
    }
  };

  return (
    <PostsContext.Provider value={{
      posts,
      comments,
      hasMore,
      nextPage,
      loading,
      error,
      fetchPosts,  // Make fetchPosts available to other components
      addPost,
      deletePost,
      likeUnlikePost,
      addComment,
      fetchComments
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export default PostsContext;
