"use client";

import Link from "next/link";

export default function InscriptionPage() {
    return (<main className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-3xl px-4 py-16 space-y-8">
                <header className="space-y-2">
                    <h1 className="text-2xl font-semibold">
                        Créer un compte
                    </h1>
                    <p className="text-sm text-slate-400">
                        Sélectionnez le type de compte à créer.
                    </p>
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                    <CategoryCard
                        title="Commerçant"
                        description="Inscrire un commerce pour déposer des colis dans le réseau."
                        href="/inscription/commercant"
                    />
                    <CategoryCard
                        title="Point relais"
                        description="Devenir point relais pour recevoir et remettre des colis."
                        href="/inscription/point-relais"
                    />
                </div>

                <p className="text-sm text-slate-400">
                    Vous avez déjà un compte ?{" "}
                    <Link
                        href="/login"
                        className="text-blue-400 hover:text-blue-300"
                    >
                        Se connecter
                    </Link>
                </p>
            </div>
        </main>);
}

function CategoryCard({title, description, href}) {
    return (<Link href={href}>
            <div
                className="h-full rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-2 hover:border-blue-500 transition">
                <h2 className="font-semibold">{title}</h2>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
        </Link>);
}