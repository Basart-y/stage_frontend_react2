"use client";

import {useEffect, useId, useMemo, useRef, useState} from "react";
import {Check, ChevronDown, Search, X} from "lucide-react";

function normalize(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export default function Combobox({
    label,
    value = "",
    onChange,
    onSelect,
    options = [],
    placeholder = "Rechercher...",
    emptyText = "Aucun résultat",
    hint,
    required = false,
    allowCustom = true,
    getOptionLabel = (option) => option?.label || "",
    getOptionDescription = (option) => option?.description || "",
    getOptionKey = (option) => option?.id || getOptionLabel(option),
}) {
    const id = useId();
    const rootRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const filtered = useMemo(() => {
        const query = normalize(value);
        const ranked = options.map((option) => {
            const label = normalize(getOptionLabel(option));
            const description = normalize(getOptionDescription(option));
            const haystack = `${label} ${description}`;
            let score = 3;
            if (!query) score = 2;
            else if (label.startsWith(query)) score = 0;
            else if (label.split(/\s+/).some((word) => word.startsWith(query))) score = 1;
            else if (haystack.includes(query)) score = 2;
            return {option, score};
        }).filter(({score}) => score < 3)
          .sort((a, b) => a.score - b.score || getOptionLabel(a.option).localeCompare(getOptionLabel(b.option), "fr"));
        return ranked.slice(0, 8).map(({option}) => option);
    }, [value, options, getOptionLabel, getOptionDescription]);

    useEffect(() => {
        function close(event) {
            if (!rootRef.current?.contains(event.target)) setOpen(false);
        }
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    useEffect(() => setActiveIndex(0), [value]);

    function choose(option) {
        const labelValue = getOptionLabel(option);
        onChange?.(labelValue);
        onSelect?.(option);
        setOpen(false);
    }

    function handleKeyDown(event) {
        if (!open && ["ArrowDown", "ArrowUp"].includes(event.key)) setOpen(true);
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
        } else if (event.key === "Enter" && open && filtered[activeIndex]) {
            event.preventDefault();
            choose(filtered[activeIndex]);
        } else if (event.key === "Escape") {
            setOpen(false);
        }
    }

    return <div ref={rootRef} className="relative space-y-2">
        {label && <label className="block text-[13px] font-semibold text-slate-700" htmlFor={id}>{label}</label>}
        <div className="relative">
            <Search aria-hidden="true" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input
                id={id}
                role="combobox"
                aria-expanded={open}
                aria-controls={`${id}-listbox`}
                aria-autocomplete="list"
                required={required}
                value={value}
                placeholder={placeholder}
                autoComplete="off"
                onFocus={() => setOpen(true)}
                onClick={() => setOpen(true)}
                onChange={(event) => { onChange?.(event.target.value); setOpen(true); }}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-20 text-[14px] text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                {value && <button type="button" aria-label="Effacer" onClick={() => {onChange?.(""); setOpen(true);}} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={15}/></button>}
                <button type="button" aria-label="Afficher les choix" onClick={() => setOpen((state) => !state)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><ChevronDown size={16} className={open ? "rotate-180 transition" : "transition"}/></button>
            </div>
        </div>
        {hint && <p className="text-xs leading-5 text-slate-500">{hint}</p>}

        {open && <div id={`${id}-listbox`} role="listbox" className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_50px_rgba(15,23,42,.16)]">
            {filtered.length ? filtered.map((option, index) => {
                const optionLabel = getOptionLabel(option);
                const description = getOptionDescription(option);
                const selected = normalize(optionLabel) === normalize(value);
                return <button
                    key={getOptionKey(option)}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(option)}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${activeIndex === index ? "bg-blue-50" : "hover:bg-slate-50"}`}
                >
                    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-500"}`}>{selected ? <Check size={14}/> : <Search size={13}/>}</span>
                    <span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-900">{optionLabel}</span>{description && <span className="mt-0.5 block truncate text-xs text-slate-500">{description}</span>}</span>
                </button>;
            }) : <div className="px-4 py-5 text-center text-sm text-slate-500">{allowCustom && value ? <>Aucun résultat. Vous pouvez conserver « <strong className="text-slate-700">{value}</strong> ».</> : emptyText}</div>}
        </div>}
    </div>;
}
