import { createContext, useState, useEffect, useContext, useMemo } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await api.get("/api/notification");
            setNotifications(res.data);
            setUnreadCount(res.data.filter((n) => !n.read).length);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        // Poll every 2 minutes for better performance
        const interval = setInterval(() => {
            // Only poll if page is visible (Page Visibility API)
            if (document.visibilityState === 'visible') {
                fetchNotifications();
            }
        }, 120000); // 2 minutes

        // Also fetch when page becomes visible again
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchNotifications();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/api/notification/read/${id}`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/api/notification/read-all");
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const clearAll = async () => {
        try {
            await api.delete("/api/notification/clear");
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to clear notifications", err);
        }
    };

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        clearAll
    }), [notifications, unreadCount]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};
