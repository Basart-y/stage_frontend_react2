"use client";

import Link from "next/link";

export default function Header() {

    return (<header className="h-16 border-b border-slate-800 bg-slate-900">
            <div className="h-full max-w-screen-2xl mx-auto flex items-center justify-between px-8">
                <Link href="/" className="text-lg font-semibold">
                    Site points relais
                </Link>

                <nav className="flex items-center gap-6 text-sm">
                    <Link href="/">
                        Accueil
                    </Link>

                    <Link href="/login">
                        Connexion
                    </Link>

                    <Link href="/inscription">
                        Inscription
                    </Link>

                </nav>

            </div>

        </header>);

}