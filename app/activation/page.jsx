"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest } from '@/services/api.js';

export default function ActivationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email,setEmail]=useState(params.get('email') || '');
  const [token,setToken]=useState(params.get('token') || '');
  const [password,setPassword]=useState('');
  const [confirmation,setConfirmation]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  async function submit(e){e.preventDefault();setError('');if(password!==confirmation){setError('Les mots de passe ne correspondent pas.');return;}setLoading(true);try{await apiRequest('/api/v1/invitations/accept',{method:'POST',body:JSON.stringify({email,token,password})});router.replace('/login?activated=1');}catch(err){setError(err.message||'Activation impossible.');}finally{setLoading(false);}}
  return <main className="flex min-h-screen items-center justify-center bg-[#08111f] px-5 py-10"><div className="w-full max-w-md"><Link href="/" className="mb-8 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-blue-200"></Link><p className="text-xs font-extrabold uppercase tracking-[.15em] text-blue-400">Invitation</p><h1 className="mt-3 text-3xl font-black tracking-[-.04em] text-white">Activer votre compte</h1><p className="mt-3 text-sm leading-6 text-slate-500">Saisissez les informations de l’invitation reçue puis choisissez votre mot de passe.</p><form onSubmit={submit} className="mt-7 space-y-4 rounded-2xl border border-slate-700 bg-[#111b2b] p-6">{[['E-mail','email',email,setEmail],['Jeton d’invitation','text',token,setToken],['Mot de passe','password',password,setPassword],['Confirmer le mot de passe','password',confirmation,setConfirmation]].map(([label,type,value,setter])=><label key={label} className="block"><span className="mb-2 block text-xs font-bold text-slate-400">{label}</span><input required type={type} minLength={type==='password'?8:undefined} value={value} onChange={e=>setter(e.target.value)} className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 text-sm text-slate-100 outline-none focus:border-blue-500"/></label>)}{error&&<p className="rounded-xl bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-300">{error}</p>}<button disabled={loading} className="h-12 w-full rounded-xl bg-blue-600 text-sm font-extrabold text-white disabled:opacity-60">{loading?'Activation…':'Activer mon compte'}</button></form><p className="mt-5 text-sm text-slate-500"><Link href="/login" className="font-bold text-blue-400">Retour à la connexion</Link></p></div></main>;
}
