import Link from "next/link";
import {ArrowRight, BadgeCheck, BarChart3, Check, MapPin, Store, Truck} from "lucide-react";

const features = [
    {icon: Store, title: "Expédiez sans friction", description: "Créez, centralisez et suivez vos livraisons depuis un espace métier unique."},
    {icon: MapPin, title: "Activez le bon relais", description: "Recherchez un point relais pertinent et gardez une vision claire de sa disponibilité."},
    {icon: BarChart3, title: "Pilotez vos opérations", description: "Managers et responsables suivent les demandes, statuts et actions prioritaires."},
];

export default function HomePage() {
    return <main className="min-h-screen bg-[#071426] text-white">
        <header className="relative z-20 border-b border-white/10 bg-[#071426]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8">
<div/>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Link href="/suivi-colis" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white md:inline-flex">Suivre un colis</Link><Link href="/login" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-[#111b2b]/5 hover:text-white sm:inline-flex">Connexion</Link>
                    <Link href="/inscription" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-blue-500">Créer un compte <ArrowRight size={15}/></Link>
                </div>
            </div>
        </header>

        <section className="rf-grid-bg relative overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[520px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]"/>
            <div className="absolute right-[-120px] top-44 h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]"/>
            <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.06fr_.94fr] lg:items-center lg:py-32">
                <div>
                    <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[.98] tracking-[-0.055em] sm:text-6xl xl:text-[72px]">Le flux logistique, <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">enfin lisible.</span></h1>
                    <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">La plateforme connecte commerçants, points relais et équipes de gestion dans une interface claire pour planifier, suivre et superviser chaque livraison.</p>
                    <div className="mt-9 flex flex-wrap gap-3">
                        <Link href="/inscription/commercant" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-950/30 transition hover:bg-blue-500/100">Démarrer maintenant <ArrowRight size={17}/></Link>
                    </div>
                    <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-500">{["Validation des acteurs", "Suivi des colis", "Réseau de relais"].map(item => <span key={item} className="flex items-center gap-2"><Check size={14} className="text-cyan-300"/>{item}</span>)}</div>
                </div>

                <div className="relative mx-auto w-full max-w-xl">
                    <div className="absolute -inset-8 rounded-[3rem] bg-blue-500/10 blur-3xl"/>
                    <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[#0b1b30] p-4 shadow-2xl shadow-black/30 sm:p-5">
                        <div className="flex items-center justify-between border-b border-white/8 px-1 pb-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Vue opérationnelle</p><p className="mt-1 text-sm font-semibold text-slate-200">Aujourd’hui</p></div><span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold text-emerald-300">● Réseau actif</span></div>
                        <div className="mt-4 grid grid-cols-3 gap-3">{[["24","Livraisons"],["8","Relais actifs"],["3","À valider"]].map(([v,l]) => <div key={l} className="rounded-2xl border border-white/8 bg-[#111b2b]/[0.045] p-4"><p className="text-2xl font-black tracking-tight">{v}</p><p className="mt-1 text-[10px] font-semibold text-slate-500">{l}</p></div>)}</div>
                        <div className="mt-3 rounded-2xl border border-white/8 bg-[#111b2b]/[0.035] p-4">
                            <div className="flex items-center justify-between"><p className="text-xs font-bold text-slate-300">Flux de livraison</p><Truck size={16} className="text-blue-300"/></div>
                            <div className="mt-5 space-y-4">{[["Création","Commande enregistrée",true],["Acheminement","Vers le point relais",true],["Disponible","En attente du client",false]].map(([t,d,done],i)=><div key={t} className="flex gap-3"><div className="flex flex-col items-center"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${done ? "bg-blue-600 text-white" : "border border-white/15 bg-[#111b2b]/5 text-slate-400"}`}>{i+1}</span>{i<2&&<span className="mt-1 h-7 w-px bg-[#111b2b]/10"/>}</div><div className="pt-1"><p className="text-xs font-bold text-slate-200">{t}</p><p className="mt-1 text-[11px] text-slate-500">{d}</p></div></div>)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-[#08111f] text-slate-50">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
                <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-400">Un outil, plusieurs métiers</p><h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-50 sm:text-4xl">Une expérience commune pour toute la chaîne.</h2></div>
                <div className="mt-9 grid gap-5 md:grid-cols-3">{features.map(({icon:Icon,title,description})=><article key={title} className="rounded-3xl border border-slate-700 bg-[#111b2b] p-6 shadow-[0_12px_32px_rgba(15,23,42,.05)]"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#071426] text-cyan-300"><Icon size={19}/></span><h3 className="mt-5 text-lg font-extrabold text-slate-100">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></article>)}</div>
            </div>
        </section>
    </main>;
}
