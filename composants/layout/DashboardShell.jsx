"use client";

import UserHeader from "./UserHeader";
import {Boxes, ShieldCheck} from "lucide-react";

export default function DashboardShell({role, sidebar, children}) {
    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 lg:grid lg:grid-cols-[270px_1fr]">
            <aside className="hidden min-h-screen border-r border-slate-200 bg-white text-slate-900 lg:flex lg:flex-col">
                <div className="flex h-[76px] items-center border-b border-slate-200 px-6">
                    <a href="/" aria-label="Accueil" className="group inline-flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-100">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-800 text-white shadow-sm"><Boxes size={18}/></span>
                        <span className="leading-tight"><span className="block text-sm font-black tracking-tight text-slate-950">Logistique</span><span className="block text-[10px] font-semibold text-slate-600">Gestion des relais</span></span>
                    </a>
                </div>
                <div className="rf-scrollbar flex-1 overflow-y-auto px-4 py-5">
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-800"><ShieldCheck size={17}/></span>
                        <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">Votre espace</p><p className="mt-0.5 truncate text-sm font-bold text-slate-900">{role}</p></div>
                    </div>
                    <div className="space-y-1">{sidebar}</div>
                </div>
            </aside>
            <div className="min-w-0">
                <UserHeader role={role}/>
                <main className="min-w-0">
                    <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden"><div className="rf-scrollbar overflow-x-auto">{sidebar}</div></div>
                    <div className="mx-auto w-full max-w-[1450px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9 xl:px-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
