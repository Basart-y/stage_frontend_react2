import {ArrowUpRight, Activity, PackageCheck, Gauge, WalletCards} from "lucide-react";

const icons = [Activity, PackageCheck, Gauge, WalletCards];

export default function GrillesStatistiques({stats}) {
    return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat, index) => {
        const Icon = icons[index % icons.length];
        return <article key={stat.label} className="group relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,.045)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-[0_18px_45px_rgba(37,99,235,.085)]">
            <div className="flex items-start justify-between gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm"><Icon size={18}/></span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-extrabold text-indigo-700"><ArrowUpRight size={11}/> actif</span>
            </div>
            <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-600">{stat.label}</p>
            <p className="mt-1.5 text-3xl font-black tracking-[-0.045em] text-slate-950">{stat.value}</p>
            <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-400"/></div>
        </article>;
    })}</div>;
}
