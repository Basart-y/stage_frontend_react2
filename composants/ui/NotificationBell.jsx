"use client";

import {useEffect, useState} from "react";
import {serviceNotification} from "@/services/ServiceNotification.js";

export default function NotificationBell({
                                             userId
                                         }) {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        serviceNotification
            .getUnread(userId)
            .then(setNotifications);
    }, [userId]);

    async function handleRead(id) {
        await serviceNotification.markAsRead(id);

        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }

    return (<div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative text-xl hover:text-blue-400 transition"
            >
                🔔

                {notifications.length > 0 && (<span
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs">
                        {notifications.length}
                    </span>)}
            </button>

            {open && (<div
                    className="absolute right-0 mt-4 w-80 rounded-xl border border-slate-700 bg-slate-900 shadow-xl z-50">
                    <div className="border-b border-slate-800 px-4 py-3 font-semibold">
                        Notifications
                    </div>

                    {notifications.length === 0 ? (<div className="p-4 text-sm text-slate-400">
                            Aucune notification
                        </div>) : (<div>
                            {notifications.map((notification) => (<button
                                    key={notification.id}
                                    onClick={() => handleRead(notification.id)}
                                    className="w-full text-left px-4 py-4 border-b border-slate-800 hover:bg-slate-800"
                                >
                                    <p className="font-medium">
                                        {notification.title}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {notification.message}
                                    </p>

                                    <p className="mt-2 text-xs text-slate-500">
                                        {notification.createdAt}
                                    </p>
                                </button>))}
                        </div>)}
                </div>)}
        </div>);
}