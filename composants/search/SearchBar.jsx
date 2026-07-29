import {Search} from "lucide-react";

export default function SearchBar({value, onChange, placeholder = "Rechercher..."}) {
    return <div className="relative w-full"><Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-700 bg-slate-900/70 py-2.5 pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 hover:border-slate-600 focus:border-blue-500 focus:bg-[#111b2b] focus:ring-4 focus:ring-blue-500/10"/></div>;
}
