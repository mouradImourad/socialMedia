
import React from 'react';
import Feed from '../components/Feed';
import '../styles.css';

const TempTestPage = () => {
  
  const mockPost = {
    id: 59,
    created_by: {
      id: '228358de-9147-4e8e-b0d8-66097199fe62',
      name: 'testuser',
      get_avatar: 'https://via.placeholder.com/40'
    },
    created_at_formatted: 'Just now',
    body: 'testtttttttttttttttttttttttttt',
    attachments: [],
    likes_count: 0,
    comments_count: 0,
    is_private: false
  };



  const handleDeletePost = (postId) => {
    console.log(`Post ${postId} deleted`);
  };

  return (
    <div>
      <h1>Feed Component Test</h1>
      <Feed post={mockPost} onDelete={handleDeletePost} />
    </div>
  );
};

export default TempTestPage;
