export default function Section({title, children}) {
    return (<section
            className="
                rounded-xl
                border
                border-slate-800
                bg-slate-900
                p-6
                space-y-6
            "
        >
            <h2 className="text-lg font-semibold">
                {title}
            </h2>

            {children}
        </section>);
}