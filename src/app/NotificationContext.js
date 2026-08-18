"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  subscribeToNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./services/notificationService";

import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToNotifications(user.uid, (data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const unreadCount = notifications.filter(
    (notification) => notification.read !== true,
  ).length;

  async function readNotification(notificationId) {
    await markNotificationAsRead(notificationId);
  }

  async function readAllNotifications() {
    if (!user?.uid) return;

    await markAllNotificationsAsRead(user.uid);
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        readNotification,
        readAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
