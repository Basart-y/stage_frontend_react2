export default function PageTitle({title, description, eyebrow, actions}) {
    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/70 bg-[linear-gradient(135deg,#111b2b_0%,#0f1a2a_58%,#10233d_100%)] px-5 py-6 shadow-[0_18px_55px_rgba(15,23,42,.055)] sm:px-7 sm:py-7">
            <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-blue-500/15 blur-3xl"/>
            <div className="pointer-events-none absolute -bottom-20 right-40 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl"/>
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                    {eyebrow && <div className="mb-3 flex items-center gap-2"><span className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-200">{eyebrow}</span></div>}
                    <h1 className="text-2xl font-black tracking-[-0.045em] text-slate-50 sm:text-[34px]">{title}</h1>
                    {description && <p className="mt-2.5 max-w-3xl text-sm leading-6 text-slate-500 sm:text-[15px]">{description}</p>}
                </div>
                {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
            </div>
        </div>
    );
}
