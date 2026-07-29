import {apiRequest, getAccessToken} from "@/services/api.js";
import {notificationsFictives} from "@/donnees/notificationsFictives.js";

const STORAGE_KEY = "relayflow_notifications";

function canUseStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readNotifications() {
    if (!canUseStorage()) return [...notificationsFictives];
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notificationsFictives));
            return [...notificationsFictives];
        }
        return JSON.parse(stored);
    } catch {
        return [...notificationsFictives];
    }
}

function writeNotifications(items) {
    if (canUseStorage()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const serviceNotification = {
    async getNotifications(userId) {
        if(getAccessToken()){const r=await apiRequest("/api/v1/notifications");return (r.data||[]).map(x=>({...x,read:Boolean(x.readAt||(x.readBy||[]).length)}));}
        const items = readNotifications();
        return userId ? items.filter((item) => !item.userId || String(item.userId) === String(userId)) : items;
    },

    async getUnread(userId) {
        const items = await this.getNotifications(userId);
        return items.filter((notification) => !notification.read);
    },

    async create(data) {
        const items = readNotifications();
        const numericIds = items.map((item) => Number(item.id)).filter(Number.isFinite);
        const id = numericIds.length ? Math.max(...numericIds) + 1 : 1;
        const now = new Date().toISOString();
        const notification = {
            id,
            title: data.title || "Information",
            message: data.message || "",
            type: data.type || "INFO",
            read: false,
            date: now,
            createdAt: now,
            userId: data.userId || null,
            role: data.role || null,
            href: data.href || null,
        };
        writeNotifications([notification, ...items]);
        return notification;
    },

    async markAsRead(id) {
        if(getAccessToken()){await apiRequest("/api/v1/notifications/read",{method:"POST",body:JSON.stringify({ids:[id]})});return true;}
        const items = readNotifications();
        const index = items.findIndex((notification) => String(notification.id) === String(id));
        if (index === -1) return null;
        items[index] = {...items[index], read: true};
        writeNotifications(items);
        return items[index];
    },

    async markAllAsRead(userId) {
        if(getAccessToken()){const r=await apiRequest("/api/v1/notifications");const ids=(r.data||[]).map(x=>x.id);if(ids.length)await apiRequest("/api/v1/notifications/read",{method:"POST",body:JSON.stringify({ids})});return true;}
        const items = readNotifications().map((item) => {
            const belongs = !userId || !item.userId || String(item.userId) === String(userId);
            return belongs ? {...item, read: true} : item;
        });
        writeNotifications(items);
        return true;
    },
};

export default serviceNotification;
