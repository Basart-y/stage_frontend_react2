import {AlertCircle, CheckCircle2, Info} from "lucide-react";

const variants = {
    success: {classes: "border-emerald-200 bg-emerald-500/10 text-emerald-200", Icon: CheckCircle2},
    error: {classes: "border-red-200 bg-red-500/10 text-red-200", Icon: AlertCircle},
    info: {classes: "border-blue-200 bg-blue-500/10 text-blue-800", Icon: Info},
};

export default function Alert({type = "success", message}) {
    const variant = variants[type] ?? variants.info;
    const Icon = variant.Icon;
    if (!message) return null;
    return <div className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm ${variant.classes}`} role="status"><Icon className="mt-0.5 shrink-0" size={18}/><p className="leading-5">{message}</p></div>;
}
