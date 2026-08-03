export default function Select({label, name, value, onChange, children, required = false, disabled = false}) {
    const valueProps = onChange ? {value: value ?? "", onChange} : {defaultValue: value ?? ""};
    return <div className="space-y-2">{label && <label className="block text-[13px] font-semibold text-slate-700" htmlFor={name}>{label}</label>}<select id={name} name={name} {...valueProps} required={required} disabled={disabled} className="w-full rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2.5 text-[14px] text-slate-900 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-600">{children}</select></div>;
}
