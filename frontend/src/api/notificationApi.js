import API from "./api";

export const getNotifications = () => API.get("/notification");
export const markNotificationRead = (id) => API.put(`/notification/read/${id}`);
export const clearNotifications = () => API.delete("/notification/clear");
