export default function PageTitle({title, description, eyebrow, actions}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                    {eyebrow && <div className="mb-3"><span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-800">{eyebrow}</span></div>}
                    <h1 className="text-2xl font-black tracking-[-0.035em] text-slate-950 sm:text-[34px]">{title}</h1>
                    {description && <p className="mt-2.5 max-w-3xl text-sm leading-6 text-slate-600 sm:text-[15px]">{description}</p>}
                </div>
                {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
            </div>
        </div>
    );
}
