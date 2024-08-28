import React, { useContext, useRef, useCallback, useState } from 'react';
import MyNavbar from './MyNavbar';
import WeatherWidget from './WeatherWidget';
// import YouTubeWidget from './YouTubeWidget';
// import NewsWidget from './NewsWidget';
import PostsContext from './PostsContext';

const Home = () => {
  const { posts, addPost, deletePost, likeUnlikePost, addComment, comments, loading, error, hasMore, nextPage, fetchPosts } = useContext(PostsContext);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [visibleComments, setVisibleComments] = useState({});
  const observer = useRef();

  const handlePostCreation = async (event) => {
    event.preventDefault();
    await addPost(newPostContent);
    setNewPostContent('');
  };

  const toggleCommentsVisibility = (postId) => {
    setVisibleComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts(nextPage);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, nextPage, fetchPosts]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <>
      <MyNavbar />
      <div className="container-fluid mt-5" style={{ padding: '0 10px' }}>
        <div className="row no-gutters">
          {/* Left Sidebar */}
          <div className="col-md-3" style={{ flexBasis: '30%' }}>
            <div className="card shadow-sm mb-4">
              <div className="card-body text-center">
                <h4>Left Sidebar</h4>
                <p>This can include navigation links, user profile info, or other relevant content.</p>
              </div>
            </div>
          </div>

          {/* Middle Content Area */}
          <div className="col-md-4" style={{ flexBasis: '40%' }}>
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

            {/* General Posts */}
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <div
                  key={`${post.id}-${index}`}
                  className="card shadow-sm mb-4"
                  style={{ height: 'auto' }}
                  ref={posts.length === index + 1 ? lastPostElementRef : null}
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
                      <button className="btn btn-outline-primary" onClick={() => likeUnlikePost(post.id)}>
                        {post.likes_count} Like{post.likes_count !== 1 ? 's' : ''}
                      </button>
                      <button className="btn btn-outline-danger" onClick={() => deletePost(post.id)}>
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
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() => addComment(post.id, newCommentContent)}
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
          </div>

          {/* Right Sidebar */}
          <div className="col-md-3" style={{ flexBasis: '30%' }}>
            <WeatherWidget />
            {/* <NewsWidget /> */}
            {/* <YouTubeWidget /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
