export default function Textarea({label, name, value, placeholder, onChange}) {
    return (<div className="space-y-2">
            <label className="text-sm text-slate-400">
                {label}
            </label>

            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={5}
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
                    resize-none
                "
            />
        </div>);
}