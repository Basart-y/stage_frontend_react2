import Link from 'next/link';
import { Building2, Landmark, MapPin, Shield, WalletCards } from 'lucide-react';
const spaces=[
 {href:'/connexion/commercant',label:'Commerçant',desc:'Livraisons, suivi et signalements',icon:Building2},
 {href:'/connexion/point-relais',label:'Point de relais',desc:'Réception, remise et retours',icon:MapPin},
 {href:'/connexion/gestionnaire',label:'Gestionnaire',desc:'Supervision opérationnelle',icon:Shield},
 {href:'/connexion/super-gestionnaire',label:'Super gestionnaire',desc:'Administration globale',icon:Landmark},
 {href:'/connexion/finance',label:'Gestionnaire financier',desc:'Factures et paiements',icon:WalletCards},
];
export default function LoginSelector(){return <main className="min-h-screen bg-slate-50 px-5 py-14"><div className="mx-auto max-w-5xl"><Link href="/" className="text-sm font-bold text-blue-700">← Retour à l’accueil</Link><p className="mt-12 text-xs font-black uppercase tracking-[.16em] text-blue-700">Accès sécurisé</p><h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Choisissez votre espace de connexion</h1><p className="mt-4 max-w-2xl text-slate-600">Chaque portail est séparé et l’API vérifie que le rôle du compte correspond à l’espace choisi.</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{spaces.map(({href,label,desc,icon:Icon})=><Link key={href} href={href} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={21}/></span><h2 className="mt-5 text-lg font-black text-slate-950">{label}</h2><p className="mt-2 text-sm text-slate-600">{desc}</p><p className="mt-5 text-sm font-bold text-blue-700">Ouvrir l’espace →</p></Link>)}</div></div></main>}
