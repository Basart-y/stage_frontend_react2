import { Search } from "lucide-react";

export default function SearchBar({ placeholder = "Rechercher...", className = "", ...props }) {
    return (
        <div className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 ${className}`}>
            <Search size={16} className="text-slate-400" />
            <input
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
}
{/* Champ de recherche avec une icône */}