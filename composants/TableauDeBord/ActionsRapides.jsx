import Link from "next/link";
import {ArrowRight, Sparkles} from "lucide-react";

export default function ActionsRapides({actions}) {
    return <div className="grid gap-4 md:grid-cols-3">{actions.map((action, index) => <Link key={action.href} href={action.href} className="group relative min-h-40 overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(37,99,235,.09)]">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 transition duration-300 group-hover:scale-125 group-hover:bg-blue-100/80"/>
        <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700"><Sparkles size={16}/></span>
                <span className="text-[10px] font-black uppercase tracking-[.14em] text-slate-700">0{index + 1}</span>
            </div>
            <p className="mt-5 font-extrabold tracking-[-0.02em] text-slate-950">{action.label}</p>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">{action.description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-blue-700">Ouvrir <ArrowRight size={14} className="transition group-hover:translate-x-1"/></span>
        </div>
    </Link>)}</div>;
}
