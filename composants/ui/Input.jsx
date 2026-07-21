export default function Input({label, name, value, onChange, placeholder, type = "text"}) {
    return (<div className="space-y-2">
            {label && (<label
                    className="text-sm text-slate-300"
                    htmlFor={name}
                >
                    {label}
                </label>)}

            <input
                id={name}
                name={name}
                type={type}
                value={value ?? ""}
                onChange={onChange ?? (() => {
                })}
                placeholder={placeholder}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 text-white p-3"
            />
        </div>);
}