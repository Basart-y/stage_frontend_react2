import {Search} from "lucide-react";

export default function SearchBar({value, onChange, placeholder = "Rechercher..."}) {
    return <div className="relative w-full"><Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"/><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-600 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"/></div>;
}
