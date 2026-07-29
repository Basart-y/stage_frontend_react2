"use client";

import {useEffect, useState} from "react";
import {Bell} from "lucide-react";
import {serviceNotification} from "@/services/ServiceNotification.js";

export default function NotificationBell({userId}) {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    useEffect(() => { serviceNotification.getUnread(userId).then(setNotifications); }, [userId]);
    async function handleRead(id) { await serviceNotification.markAsRead(id); setNotifications((prev) => prev.filter((notification) => notification.id !== id)); }
    return <div className="relative">
        <button type="button" onClick={() => setOpen((current) => !current)} className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-[#111b2b] text-slate-300 transition hover:bg-slate-900/60 hover:text-slate-50" aria-label="Afficher les notifications" aria-expanded={open}>
            <Bell size={18}/>{notifications.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white ring-2 ring-white">{notifications.length}</span>}
        </button>
        {open && <div className="absolute right-0 z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-700 bg-[#111b2b] shadow-xl">
            <div className="border-b border-slate-800 px-4 py-3"><p className="font-semibold text-slate-100">Notifications</p><p className="mt-0.5 text-xs text-slate-500">{notifications.length} non lue(s)</p></div>
            {notifications.length === 0 ? <div className="p-5 text-sm text-slate-500">Aucune nouvelle notification.</div> : <div className="max-h-80 overflow-y-auto">{notifications.map((notification) => <button type="button" key={notification.id} onClick={() => handleRead(notification.id)} className="w-full border-b border-slate-800 px-4 py-4 text-left transition last:border-b-0 hover:bg-slate-900/60"><p className="font-semibold text-slate-100">{notification.title}</p><p className="mt-1 text-sm leading-5 text-slate-500">{notification.message}</p><p className="mt-2 text-xs text-slate-400">{notification.createdAt}</p></button>)}</div>}
        </div>}
    </div>;
}
