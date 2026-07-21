"use client";

import Link from "next/link";

export default function HomePage() {
    return (<main className="min-h-screen bg-slate-900 text-slate-50">
            <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 space-y-6">
                <h1 className="text-3xl font-semibold text-center">
                    Plateforme de gestion de livraisons
                </h1>
                <p className="text-sm text-slate-400 text-center">
                    Accédez à votre espace ou créez un compte pour utiliser la
                    plateforme.
                </p>

                <div className="flex gap-4">
                    <Link
                        href="/login"
                        className="rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500 transition"
                    >
                        Se connecter
                    </Link>
                    <Link
                        href="/inscription"
                        className="rounded-lg border border-slate-600 px-6 py-3 font-medium hover:border-blue-400 transition"
                    >
                        S&apos;inscrire
                    </Link>
                </div>
            </div>
        </main>);
}