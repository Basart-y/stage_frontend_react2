import Link from "next/link";

export default function PageIntrouvable() {

    return (<div className="min-h-screen flex items-center justify-center">

            <div className="text-center space-y-5">
                <h1 className="text-5xl font-bold">
                    404
                </h1>
                <p className="text-slate-400">
                    Cette page n'existe pas.
                </p>
                <Link
                    href="/"
                    className="inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    Retour accueil
                </Link>
            </div>
        </div>

    );

}