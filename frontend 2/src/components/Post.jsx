// src/components/Post.jsx
import React from 'react';

const Post = ({ post }) => {
    return (
        <div className="post">
            <p>{post.content}</p>
            {post.image && <img src={post.image} alt="Post content" />}
            {post.video && <video controls src={post.video} />}
        </div>
    );
};

export default Post;
