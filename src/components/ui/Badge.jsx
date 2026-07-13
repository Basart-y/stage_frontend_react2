export default function Badge({ children, variant = "default", className = "" }) {
    const variants = {
        default: "bg-white/10 text-slate-200 border-white/10",
        success: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
        warning: "bg-amber-500/15 text-amber-300 border-amber-400/20",
        danger: "bg-rose-500/15 text-rose-300 border-rose-400/20",
        info: "bg-sky-500/15 text-sky-300 border-sky-400/20",
    };

    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
    );
}

{/* Etiquette colorée qui sert à afficher une couleur selon le statut , children texte du badge , variant type de badge (couleur) , className permet d'ajouter d'autres classes Tailwind */}