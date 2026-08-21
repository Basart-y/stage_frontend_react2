import Link from "next/link";
import {ArrowRight, BarChart3, Check, MapPin, Store} from "lucide-react";

const features = [
    {icon: Store, title: "Expédiez sans friction", description: "Créez, centralisez et suivez vos livraisons depuis un espace métier unique."},
    {icon: MapPin, title: "Activez le bon relais", description: "Recherchez un point relais pertinent et gardez une vision claire de sa disponibilité."},
    {icon: BarChart3, title: "Pilotez vos opérations", description: "Managers et responsables suivent les demandes, statuts et actions prioritaires."},
];

export default function HomePage() {
    return <main className="min-h-screen bg-slate-100 text-slate-950">
        <header className="relative z-20 border-b border-slate-200 bg-slate-100/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8">
<div/>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Link href="/suivi-colis" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white/5 hover:text-slate-950 md:inline-flex">Suivre un colis</Link><Link href="/login" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white/5 hover:text-slate-950 sm:inline-flex">Connexion</Link>
                    <Link href="/inscription" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-indigo-700">Créer un compte <ArrowRight size={15}/></Link>
                </div>
            </div>
        </header>

        <section className="rf-grid-bg relative overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[520px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]"/>
            <div className="absolute right-[-120px] top-44 h-80 w-80 rounded-full bg-indigo-400/10 blur-[100px]"/>
            <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mx-auto mt-7 max-w-3xl text-5xl font-black leading-[.98] tracking-[-0.055em] sm:text-6xl xl:text-[72px]">Le flux logistique, <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">enfin lisible.</span></h1>
                    <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">La plateforme connecte commerçants, points relais et équipes de gestion dans une interface claire pour planifier, suivre et superviser chaque livraison.</p>
                    <div className="mt-9 flex flex-wrap justify-center gap-3">
                        <Link href="/inscription/commercant" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-950/30 transition hover:bg-indigo-700/100">Démarrer maintenant <ArrowRight size={17}/></Link>
                    </div>
                    <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-600">{["Validation des acteurs", "Suivi des colis", "Réseau de relais"].map(item => <span key={item} className="flex items-center gap-2"><Check size={14} className="text-indigo-700"/>{item}</span>)}</div>
                </div>

            </div>
        </section>

        <section className="bg-slate-50 text-slate-950">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
                <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-700">Un outil, plusieurs métiers</p><h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">Une expérience commune pour toute la chaîne.</h2></div>
                <div className="mt-9 grid gap-5 md:grid-cols-3">{features.map(({icon:Icon,title,description})=><article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,.05)]"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-indigo-700"><Icon size={19}/></span><h3 className="mt-5 text-lg font-extrabold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article>)}</div>
            </div>
        </section>
    </main>;
}
