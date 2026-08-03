"use client";

import {useEffect, useState} from "react";

import serviceNotification from "@/services/ServiceNotification.js";


export default function NotificationList() {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        serviceNotification
            .getNotifications()
            .then(setNotifications);

    }, []);


    async function handleRead(id) {

        await serviceNotification.markAsRead(id);

        setNotifications(notifications.map(notification => notification.id === id ? {
            ...notification, read: true
        } : notification));

    }


    return (

        <div className="space-y-4">
            {notifications.length === 0 ?

                (<p className="text-slate-600">
                        Aucune notification
                    </p>)

                :

                notifications.map(notification => (

                    <div key={notification.id}
                         className={`rounded-xl border p-4
                            ${notification.read ? "border-slate-200" : "border-blue-500 bg-blue-500/10"}
                        `}
                    >

                        <h3 className="font-semibold">
                            {notification.title}
                        </h3>


                        <p className="text-sm text-slate-600">
                            {notification.message}
                        </p>


                        {!notification.read && (<button
                                onClick={() => handleRead(notification.id)}
                                className="mt-3 text-sm text-blue-700">
                                Marquer comme lu
                            </button>)}
                    </div>))}
        </div>);
}