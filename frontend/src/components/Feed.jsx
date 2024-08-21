import React, { useEffect, useState } from 'react';
import Post from './Post';
import './Feed.css';

const Feed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/api/posts') // Replace with your actual API endpoint
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    return (
        <div className="feed">
            {posts.map(post => (
                <Post key={post.id} post={post} userProfilePicture={post.user.profile_picture} />
            ))}
        </div>
    );
};

export default Feed;
