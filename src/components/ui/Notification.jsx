export default function Notification({ type = "info", message, onClose }) {
    const colors = {
        info: "border-sky-400/20 bg-sky-500/10 text-sky-200",
        success: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
        warning: "border-amber-400/20 bg-amber-500/10 text-amber-200",
        danger: "border-rose-400/20 bg-rose-500/10 text-rose-200",
    };

    return (
        <div className={`rounded-2xl border px-4 py-3 shadow-lg ${colors[type]}`}>
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm">{message}</p>
                {onClose && (
                    <button onClick={onClose} className="text-xs font-medium opacity-80 hover:opacity-100">
                        Fermer
                    </button>
                )}
            </div>
        </div>
    );
}
{/* Affiche un message selon le type*/}