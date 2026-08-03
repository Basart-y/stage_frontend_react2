const variants = {
    blue: "bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700 focus:ring-blue-200",
    green: "bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700 focus:ring-indigo-200",
    red: "bg-red-600 text-white shadow-red-600/20 hover:bg-red-700 focus:ring-red-200",
    neutral: "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-300/20",
};

export default function ActionButton({children, onClick, color = "blue", type = "button", disabled = false}) {
    return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${variants[color] ?? variants.blue}`}>{children}</button>;
}
