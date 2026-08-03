"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, Building2, Landmark, LogIn, MapPinHouse, ShieldCheck } from 'lucide-react';
import { serviceAuthentification } from '@/services/ServiceAuthentification.js';

const ROLE_CONFIG = {
  commercant: { label: 'Commerçant', Icon: Building2 },
  point_relais: { label: 'Point de relais', Icon: MapPinHouse },
  gestionnaire: { label: 'Gestionnaire', Icon: BriefcaseBusiness },
  super_gestionnaire: { label: 'Super gestionnaire', Icon: ShieldCheck },
  gestionnaire_financier: { label: 'Gestionnaire financier', Icon: Landmark },
};

export default function RoleLoginPage({ role }) {
  const router = useRouter();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const config = ROLE_CONFIG[role] || { label: role, Icon: ShieldCheck };
  const { label, Icon } = config;
  useEffect(()=>{ const current=serviceAuthentification.getCachedUser(); if(current?.role===role) router.replace(serviceAuthentification.getHomeForRole(role)); },[role,router]);
  async function submit(event){ event.preventDefault(); setError(''); setLoading(true); try{ const session=await serviceAuthentification.login(email,password,role); router.replace(session.home); }catch(err){ setError(err.message||'Connexion impossible.'); }finally{ setLoading(false); } }
  return <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:flex lg:items-center lg:justify-center lg:py-12">
    <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative overflow-hidden bg-blue-900 p-8 text-white sm:p-10 lg:p-12">
        <Link href="/" className="relative inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"><ArrowLeft size={16}/>Accueil</Link>
        <div className="relative mt-20 lg:mt-28">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-900 shadow-lg"><Icon size={31}/></div>
          <p className="mt-8 text-xs font-black uppercase tracking-[.2em] text-blue-100">Portail sécurisé</p>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">Connexion {label}</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-blue-100">Accès réservé aux comptes ayant le rôle « {label} ». Le serveur vérifie le rôle avant d’ouvrir la session.</p>
        </div>
        <div className="relative mt-16 flex items-center gap-2 text-xs font-semibold text-blue-100"><ShieldCheck size={15}/>Authentification et permissions vérifiées</div>
      </section>
      <section className="flex items-center bg-white p-6 sm:p-10 lg:p-14">
        <div className="w-full">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-blue-900"><Icon size={14}/> Espace {label}</span>
          <h2 className="mt-6 text-3xl font-black tracking-[-0.035em] text-slate-950">Bienvenue</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Saisissez les identifiants associés à votre espace.</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Adresse e-mail</span><input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100" placeholder="vous@entreprise.fr"/></label>
            <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Mot de passe</span><input type="password" required minLength={8} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100" placeholder="••••••••"/></label>
            {error&&<p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-800">{error}</p>}
            <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-800 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-wait disabled:opacity-60"><LogIn size={17}/>{loading?'Connexion…':`Se connecter ${label}`}</button>
          </form>
          <p className="mt-6 text-center text-xs leading-5 text-slate-500">Les comptes d’un autre rôle sont automatiquement refusés.</p>
        </div>
      </section>
    </div>
  </main>;
}
