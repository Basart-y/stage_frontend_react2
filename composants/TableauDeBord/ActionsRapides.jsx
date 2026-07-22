import Link from "next/link";

export default function ActionsRapides({actions}) {

    return (
        <div className="grid md:grid-cols-3gap-4">
            {
                actions.map(action => (
                    <Link
                        key={action.href}
                        href={action.href}
                        className="
                            rounded-xl
                            border
                            border-slate-800
                            bg-slate-900
                            p-5
                            hover:bg-slate-800
                        "
                    >
                        <p className="font-semibold">
                            {action.label}
                        </p>

                        <p className="text-sm text-slate-400 mt-2">
                            {action.description}
                        </p>
                    </Link>
                ))
            }
        </div>
    );

}