import React, { useState, useEffect } from 'react';
import { notificationRead, userNotification } from '../../api/services/userServices';

function Notification() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationMarkAsRead, setNotificationMarkAsRead] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError('');
        const fetchedNotifications = await userNotification();
        setNotifications(fetchedNotifications);
        console.log('Fetched Notifications: ', fetchedNotifications);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

  }, []);

  const handleNotificationRead = async () => {
    try {
     const notificationIds = notifications.map((notification) => notification._id)
     const data = await notificationRead(notificationIds);
     setNotificationMarkAsRead(data)
     console.log("Not mark data: ", data)
     setNotifications((prevNotifications) =>
       prevNotifications.map((notification) =>
         notificationIds.includes(notification._id)
           ? { ...notification, read: true }
           : notification
       )
     );
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
   }


  if (loading) return <p>loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="notification-modal-overlay">
    <div className="notification-modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="notification-modal-header">
        <h2>Notifications</h2>
        <button onClick={handleNotificationRead}>Read</button>
      </div>
      <ul className="notification-list">
        {notifications.map((notification, index) => (
          <li key={index}>
            <span>{notification.sender.username}</span>
            <span>{notification.content}</span>
            <span>{notification.type}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};

export default Notification;
