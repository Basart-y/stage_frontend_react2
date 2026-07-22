"use client";

import Link from "next/link";
import NotificationBell from "@/composants/ui/NotificationBell";

export default function UserHeader({userId = 1, role}) {
    return (<header className="h-16 border-b border-slate-800 bg-slate-900">
        <div className="h-full flex items-center justify-between px-8">
            <Link href="/" className="text-lg font-semibold"
            >
                Site Relais
            </Link>

            <div className="flex items-center gap-4">
                <Link href="/" className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
                >
                    Accueil
                </Link>

                <NotificationBell userId={userId}/>
                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                        {role ?? "Utilisateur"}
                    </span>

                <Link href="/login" className="rounded-lg bg-red-600 px-4 py-2 text-sm hover:bg-red-500">
                    Déconnexion
                </Link>
            </div>
        </div>
    </header>);
}