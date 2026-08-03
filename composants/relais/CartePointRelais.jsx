"use client";

import {MapPin, CheckCircle2} from "lucide-react";

export default function CartePointRelais({relay, selected, onClick}) {
    const status = relay.status || "ACTIF";
    const isActive = ["actif", "ouvert", "open"].includes(String(status).toLowerCase());

    return <article className={`rounded-3xl border bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,.04)] transition ${selected ? "border-blue-300 ring-4 ring-blue-50" : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_35px_rgba(15,23,42,.07)]"}`}>
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <h3 className="truncate font-extrabold tracking-[-0.01em] text-slate-900">{relay.name}</h3>
                <div className="mt-2.5 flex items-start gap-2 text-sm leading-5 text-slate-600"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><MapPin size={14}/></span><span>{relay.address}<br/>{relay.postalCode} {relay.city}</span></div>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${isActive ? "bg-indigo-500/10 text-indigo-700" : "bg-amber-500/10 text-amber-800"}`}>{status}</span>
        </div>
        <button type="button" onClick={onClick} className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${selected ? "bg-blue-500/10 text-blue-700" : "bg-slate-100 text-slate-950 hover:bg-blue-700"}`}>{selected && <CheckCircle2 size={17}/>} {selected ? "Relais sélectionné" : "Sélectionner ce relais"}</button>
    </article>;
}
