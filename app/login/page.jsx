"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, House, LockKeyhole, LogIn, PackageCheck } from 'lucide-react';
import { serviceAuthentification } from '@/services/ServiceAuthentification.js';

function HomeLink({mobile=false}) {
  return <Link href="/" className={`relative inline-flex items-center gap-2.5 rounded-xl border border-blue-400/20 bg-blue-400/10 px-3.5 py-2 text-xs font-extrabold text-blue-100 transition hover:border-blue-300/40 hover:bg-blue-400/15 ${mobile?'mb-8 lg:hidden':''}`}>
    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20"><House size={15}/></span>
    <span>Retour à l’accueil</span><ArrowLeft size={13} className="opacity-60"/>
  </Link>;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const current = serviceAuthentification.getCachedUser();
    if (current?.role) router.replace(serviceAuthentification.getHomeForRole(current.role));
  }, [router]);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await serviceAuthentification.login(email, password);
      const requested = searchParams.get('next');
      router.replace(requested?.startsWith('/') ? requested : session.home);
    } catch (err) {
      setError(err.message || 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  }

  return <main className="min-h-screen bg-[#071426] lg:grid lg:grid-cols-[.9fr_1.1fr]">
    <section className="rf-grid-bg relative hidden overflow-hidden border-r border-white/8 p-10 text-white lg:flex lg:flex-col xl:p-14">
      <div className="absolute -left-20 top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]"/>
      <HomeLink/>
      <div className="relative my-auto max-w-lg"><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111b2b]/5 px-3 py-1.5 text-xs font-bold text-blue-200"><LockKeyhole size={14}/> Accès sécurisé</span><h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-[-0.05em]">Votre espace logistique, selon votre rôle.</h1><p className="mt-6 text-base leading-7 text-slate-400">Connectez-vous avec vos identifiants. Votre rôle détermine votre espace principal et les actions accessibles.</p></div>
      <p className="relative inline-flex items-center gap-2 text-xs text-slate-300"><PackageCheck size={14}/> Gestion des livraisons et points relais</p>
    </section>
    <section className="flex min-h-screen items-center bg-[#08111f] px-5 py-10 sm:px-8 lg:min-h-0">
      <div className="mx-auto w-full max-w-md">
        <HomeLink mobile/>
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-blue-400">Connexion</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-50 sm:text-4xl">Accéder à votre espace</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">Saisissez votre adresse e-mail et votre mot de passe.</p>

        <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-slate-700 bg-[#111b2b] p-5 sm:p-6">
          <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.1em] text-slate-400">E-mail</span><input type="email" required autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 text-sm text-slate-100 outline-none transition focus:border-blue-500" placeholder="vous@entreprise.fr"/></label>
          <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.1em] text-slate-400">Mot de passe</span><input type="password" required minLength={8} autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 text-sm text-slate-100 outline-none transition focus:border-blue-500" placeholder="••••••••"/></label>
          {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-300">{error}</p>}
          <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"><LogIn size={17}/>{loading ? 'Connexion…' : 'Se connecter'}</button>
        </form>
      </div>
    </section>
  </main>;
}
