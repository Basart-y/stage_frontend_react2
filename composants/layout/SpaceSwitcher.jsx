"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Layers3 } from "lucide-react";
import { serviceAuthentification } from "@/services/ServiceAuthentification.js";

const spaces = [
  { role: "super_gestionnaire", label: "Super gestionnaire", href: "/supermanager/dashboard" },
  { role: "gestionnaire", label: "Gestionnaire", href: "/manager/dashboard" },
  { role: "gestionnaire_financier", label: "Gestionnaire financier", href: "/finance/dashboard" },
  { role: "commercant", label: "Commerçant", href: "/commercant/dashboard" },
  { role: "point_relais", label: "Point relais", href: "/point-relais/dashboard" },
];

function roleFromPath(pathname) {
  if (pathname.startsWith("/supermanager")) return "super_gestionnaire";
  if (pathname.startsWith("/manager")) return "gestionnaire";
  if (pathname.startsWith("/finance")) return "gestionnaire_financier";
  if (pathname.startsWith("/commercant")) return "commercant";
  if (pathname.startsWith("/point-relais")) return "point_relais";
  return null;
}

export default function SpaceSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(serviceAuthentification.getCachedUser());
  }, [pathname]);

  const currentRole = roleFromPath(pathname) || user?.role;
  const current = spaces.find((space) => space.role === currentRole);
  const available = useMemo(() => {
    if (!user?.role) return [];
    // Le Super Gestionnaire dispose d'un mode multi-espace pour contrôler l'ensemble de l'application.
    if (user.role === "super_gestionnaire") return spaces;
    return spaces.filter((space) => space.role === user.role);
  }, [user]);

  if (available.length <= 1) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm font-bold text-slate-200 transition hover:border-slate-600 hover:text-white"
        aria-expanded={open}
      >
        <Layers3 size={16} className="text-blue-400" />
        <span className="hidden sm:inline">{current?.label || "Changer d’espace"}</span>
        <ChevronDown size={15} />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-40 cursor-default" aria-label="Fermer" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-slate-700 bg-[#111b2b] p-2 shadow-2xl">
            <div className="px-3 pb-2 pt-1">
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-blue-400">Accès multi-espace</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Super Gestionnaire : ouvrez les vues des cinq espaces sans vous déconnecter.</p>
            </div>
            {available.map((space) => (
              <button
                key={space.role}
                type="button"
                onClick={() => { setOpen(false); router.push(space.href); }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${space.role === currentRole ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
              >
                <span>{space.label}</span>
                {space.role === user?.role && <span className="text-[10px] font-black uppercase opacity-70">rôle compte</span>}
              </button>
            ))}
            <p className="px-3 pb-1 pt-2 text-[11px] leading-4 text-slate-500">Les droits API restent ceux du compte connecté. Une vue métier peut donc afficher certaines actions comme non autorisées.</p>
          </div>
        </>
      )}
    </div>
  );
}
