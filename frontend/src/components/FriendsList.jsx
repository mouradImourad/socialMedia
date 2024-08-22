import React, { useEffect, useState } from 'react';
import { listFriends } from '../api';  // Import the listFriends function
import './FriendsList.css';

const FriendsList = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's friends
    listFriends(userId)
      .then(response => {
        setFriends(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching friends:', error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div>Loading friends...</div>;
  }

  return (
    <div className="friends-list">
      <h3>Friends</h3>
      {friends.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        <ul>
          {friends.map(friend => (
            <li key={friend.id}>{friend.friend.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
