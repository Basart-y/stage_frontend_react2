export default function Select({label, name, value, onChange, children}) {
    return (<div className="space-y-2">
            <label className="text-sm text-slate-400">
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className="
                    w-full
                    rounded-lg
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3
                    outline-none
                    focus:border-blue-500
                "
            >
                {children}
            </select>
        </div>);
}