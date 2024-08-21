import React from 'react';

const Post = ({ post, userProfilePicture }) => {
    console.log("User Profile Picture:", userProfilePicture); // Debugging line

    return (
        <div className="post-container">
            <div className="post-profile-picture">
                <img 
                    src={userProfilePicture || '/path-to-default-image.png'} 
                    alt="User Profile" 
                    onError={(e) => { e.target.src = '/path-to-default-image.png'; }} // Fallback image
                />
            </div>
            <div className="post-content">
                <p>{post.content}</p>
                {post.image && <img src={post.image} alt="Post content" />}
                {post.video && <video controls src={post.video} />}
            </div>
        </div>
    );
};

export default Post;
