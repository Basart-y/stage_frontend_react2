import {LoaderCircle} from "lucide-react";

export default function Loading({label = "Chargement..."}) {
    return <div className="flex min-h-32 items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-slate-600"><div className="flex items-center gap-3 text-sm font-medium"><LoaderCircle className="animate-spin text-blue-700" size={20}/><span>{label}</span></div></div>;
}
