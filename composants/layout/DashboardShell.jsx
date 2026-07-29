"use client";

import UserHeader from "./UserHeader";
import {Boxes, ShieldCheck} from "lucide-react";

export default function DashboardShell({role, sidebar, children}) {
    return (
        <div className="min-h-screen bg-[#08111f] text-slate-100 lg:grid lg:grid-cols-[270px_1fr]">
            <aside className="hidden min-h-screen border-r border-white/10 bg-[#0b1422] text-white lg:flex lg:flex-col">
                <div className="flex h-[76px] items-center border-b border-white/10 px-6">
                    <a href="/" aria-label="Accueil" className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 transition hover:border-blue-400/30 hover:bg-blue-400/[0.08]">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-950/30"><Boxes size={18}/></span>
                        <span className="leading-tight"><span className="block text-sm font-black tracking-tight text-white">Logistique</span><span className="block text-[10px] font-semibold text-slate-500">Gestion des relais</span></span>
                    </a>
                </div>
                <div className="rf-scrollbar flex-1 overflow-y-auto px-4 py-5">
                    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300"><ShieldCheck size={17}/></span>
                        <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">Votre espace</p><p className="mt-0.5 truncate text-sm font-bold text-slate-100">{role}</p></div>
                    </div>
                    <div className="space-y-1">{sidebar}</div>
                </div>
            </aside>
            <div className="min-w-0">
                <UserHeader role={role}/>
                <main className="min-w-0">
                    <div className="border-b border-slate-800 bg-[#0b1422] px-4 py-3 lg:hidden"><div className="rf-scrollbar overflow-x-auto">{sidebar}</div></div>
                    <div className="mx-auto w-full max-w-[1450px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9 xl:px-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
