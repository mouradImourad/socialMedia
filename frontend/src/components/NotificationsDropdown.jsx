import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { Dropdown } from 'react-bootstrap';

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher('ec08aaeb0eb7ff36b414', {
      cluster: 'us2',
    });

    // Subscribe to the channel
    const channel = pusher.subscribe('post-channel');

    // Bind to the event within the channel
    channel.bind('post-liked', function (data) {
      // Update the notifications state with the new notification
      setNotifications((prevNotifications) => [...prevNotifications, data.message]);
    });

    // Cleanup on component unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        Notifications ({notifications.length})
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {notifications.length === 0 ? (
          <Dropdown.Item>No new notifications</Dropdown.Item>
        ) : (
          notifications.map((notification, index) => (
            <Dropdown.Item key={index}>{notification}</Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationsDropdown;
