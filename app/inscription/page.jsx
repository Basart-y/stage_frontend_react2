import Link from "next/link";
import {ArrowLeft, ArrowRight, MapPin, ShieldCheck, Store} from "lucide-react";

export default function InscriptionPage() {
    return <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-[78px] max-w-6xl items-center justify-between px-5 sm:px-8"><Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-400/10 px-3.5 py-2 text-xs font-extrabold text-blue-800 transition hover:border-blue-300/40 hover:bg-blue-400/15"><ArrowLeft size={14}/><span>Retour à l’accueil</span></Link><Link href="/login" className="text-sm font-bold text-slate-700 hover:text-blue-700">Se connecter</Link></div></header>
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
                <div className="lg:sticky lg:top-28"><span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-700"><ShieldCheck size={14}/> Inscription contrôlée</span><h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-slate-950 sm:text-5xl">Rejoignez le réseau.</h1><p className="mt-5 max-w-lg text-base leading-7 text-slate-600">Sélectionnez votre activité. Votre demande sera traitée avant l’activation définitive du compte.</p></div>
                <div className="grid gap-5 sm:grid-cols-2"><CategoryCard icon={Store} title="Commerçant" description="Créez vos livraisons, recherchez un relais et suivez vos colis depuis votre espace." href="/inscription/commercant" number="01"/><CategoryCard icon={MapPin} title="Point relais" description="Réceptionnez les colis, gérez les retraits et pilotez l’activité de votre point relais." href="/inscription/point-relais" number="02"/></div>
            </div>
        </section>
    </main>;
}

function CategoryCard({icon:Icon,title,description,href,number}) {
    return <Link href={href} className="group relative min-h-72 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,.045)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_45px_rgba(37,99,235,.1)]"><span className="absolute right-5 top-4 text-5xl font-black tracking-[-0.06em] text-slate-950">{number}</span><span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-indigo-700"><Icon size={20}/></span><div className="relative mt-16"><h2 className="text-xl font-extrabold text-slate-900">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700">Continuer <ArrowRight size={16} className="transition group-hover:translate-x-1"/></span></div></Link>;
}
