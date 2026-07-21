export default function SearchBar({
                                      value,
                                      onChange,
                                      placeholder = "Rechercher..."
                                  }) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
        />
    );
}