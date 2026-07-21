import {notificationsFictives} from "@/données/notificationsFictives.js";

let nextId = notificationsFictives.length > 0 ? Math.max(...notificationsFictives.map((n) => n.id)) + 1 : 1;

export const serviceNotification = {
    async getNotifications() {
        return notificationsFictives;
    },

    async getUnread() {
        return notificationsFictives.filter((notification) => !notification.read);
    },

    async create(data) {
        const notification = {
            id: nextId++,
            title: data.title,
            message: data.message,
            type: data.type || "INFO",
            read: false,
            date: new Date().toISOString(),
            userId: data.userId || null
        };

        notificationsFictives.push(notification);

        return notification;
    },

    async markAsRead(id) {
        const notification = notificationsFictives.find((notification) => notification.id === id);

        if (!notification) {
            return null;
        }

        notification.read = true;

        return notification;
    }
};

export default serviceNotification;