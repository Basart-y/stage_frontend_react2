export default function Input({ label, className = "", ...props }) {
    return (
        <label className="block space-y-2">
            {label && <span className="text-sm text-slate-300">{label}</span>}
            <input
                className={`w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#4F8CFF]/50 focus:ring-2 focus:ring-[#4F8CFF]/20 ${className}`}
                {...props}
            />
        </label>
    );
}
{/* Créer un champ de saisie , un même design pour tous les champs */}