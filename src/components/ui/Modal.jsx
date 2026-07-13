import { X } from "lucide-react";
import Button from "./Button";

export default function Modal({ open, onClose, title, children, footer }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0f172a]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="text-slate-300">{children}</div>

                {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
            </div>
        </div>
    );
}
{/* Fenêtre qui s'ouvre au dessus de la page, confirmation , ajout , modification*/}