"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { serviceAuthentification } from '@/services/ServiceAuthentification.js';

export default function AuthGate({ allowedRoles, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState('loading');

  useEffect(() => {
    let active = true;
    serviceAuthentification.getCurrentUser({ refresh: true })
      .then((user) => {
        if (!active) return;
        if (!user || !allowedRoles.includes(user.role)) {
          const destination = user ? serviceAuthentification.getHomeForRole(user.role) : '/login';
          router.replace(`${destination}${destination === '/login' ? `?next=${encodeURIComponent(pathname)}` : ''}`);
          return;
        }
        setState('ready');
      })
      .catch(() => {
        if (active) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      });
    return () => { active = false; };
  }, [allowedRoles, pathname, router]);

  if (state !== 'ready') {
    return <div className="flex min-h-screen items-center justify-center bg-[#08111f] text-sm font-semibold text-slate-400">Vérification de la session…</div>;
  }
  return children;
}
