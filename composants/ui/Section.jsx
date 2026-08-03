export default function Section({title, description, action, children}) {
    return <section className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_12px_38px_rgba(15,23,42,.045)]">
        {(title || action) && <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>{title && <h2 className="text-[15px] font-extrabold tracking-[-0.02em] text-slate-950">{title}</h2>}{description && <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>}</div>
            {action && <div className="shrink-0">{action}</div>}
        </div>}
        <div className="p-5 sm:p-6">{children}</div>
    </section>;
}
