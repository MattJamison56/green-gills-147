/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { database } from './firebase-config';
import { ref, set, push, onValue, remove } from 'firebase/database';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationsRef = ref(database, 'notifications');
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      const notificationsList = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key]
          }))
        : [];
      setNotifications(notificationsList);
      console.log('Notifications updated:', notificationsList); // Debugging log
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addNotification = (notification) => {
    const notificationsRef = ref(database, 'notifications');
    const newNotificationRef = push(notificationsRef);
    set(newNotificationRef, notification)
      .then(() => {
        console.log('Notification added:', notification); // Debugging log
      })
      .catch((error) => {
        console.error('Error adding notification:', error); // Debugging log
      });
  };

  const removeNotification = (id) => {
    console.log(`Attempting to remove notification with id: ${id}`); // Debugging log
    const notificationRef = ref(database, `notifications/${id}`);
    return remove(notificationRef)
      .then(() => {
        console.log(`Notification with id ${id} removed successfully.`); // Debugging log
      })
      .catch((error) => {
        console.error(`Error removing notification with id ${id}:`, error); // Debugging log
        throw error; // Propagate error to caller
      });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationContext = () => useContext(NotificationContext);
