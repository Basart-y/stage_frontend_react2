import Link from "next/link";
import {Activity, Building2, Landmark, Map, PackageCheck, ShieldCheck, Store, TrendingUp, Users} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import GrillesStatistiques from "@/composants/TableauDeBord/GrillesStatistiques.jsx";
import ActionsRapides from "@/composants/TableauDeBord/ActionsRapides.jsx";

const stats = [{label: "Managers", value: 8}, {label: "Commerces", value: 250}, {label: "Points relais", value: 95}, {label: "Livraisons", value: "1 500"}];
const actions = [
  {label: "Créer manager", href: "/supermanager/managers/create", description: "Ajouter un responsable avec son périmètre"},
  {label: "Gestion managers", href: "/supermanager/managers", description: "Administrer les comptes et affectations"},
  {label: "Statistiques", href: "/supermanager/statistiques", description: "Voir les indicateurs réseau"},
];
const spaces = [
  {label: "Super Gestionnaire", href: "/supermanager/dashboard", icon: ShieldCheck, description: "Supervision et managers"},
  {label: "Gestionnaire", href: "/manager/dashboard", icon: Users, description: "Demandes, comptes, livraisons et signalements"},
  {label: "Gestionnaire financier", href: "/finance/dashboard", icon: Landmark, description: "Factures, paiements et litiges financiers"},
  {label: "Commerçant", href: "/commercant/dashboard", icon: Store, description: "Vue métier commerçant"},
  {label: "Point relais", href: "/point-relais/dashboard", icon: PackageCheck, description: "Vue métier du point relais"},
];

export default function SuperManagerDashboardPage() {
  return <section className="space-y-8">
    <PageTitle title="Supervision" description="Vision consolidée des managers, commerces, relais et flux logistiques."/>
    <GrillesStatistiques stats={stats}/>
    <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <Section title="Santé du réseau" description="Synthèse opérationnelle de la plateforme."><div className="grid gap-3 sm:grid-cols-3"><Metric icon={Activity} label="Disponibilité" value="99,8%"/><Metric icon={TrendingUp} label="Activité 7 j" value="+12%"/><Metric icon={ShieldCheck} label="Alertes critiques" value="0"/></div></Section>
      <Section title="Couverture géographique" description="Le périmètre France est structuré par ville et département."><div className="flex items-center gap-4 rounded-2xl bg-slate-950 p-5 text-white"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111b2b]/10"><Map size={22}/></span><div><p className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Réseau actif</p><p className="mt-1 text-xl font-black">95 relais</p><p className="mt-1 text-xs text-slate-400">Pilotage par périmètres géographiques.</p></div></div></Section>
    </div>
    <Section title="Accédez aux espaces" description="Ouvrez rapidement les différentes vues métier sans vous déconnecter.">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {spaces.map(({label, href, icon: Icon, description}) => <Link key={href} href={href} className="group rounded-2xl border border-slate-700 bg-slate-900/50 p-4 transition hover:-translate-y-0.5 hover:border-blue-500/50 hover:bg-blue-500/[0.06]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 transition group-hover:bg-blue-500 group-hover:text-white"><Icon size={19}/></span>
          <p className="mt-4 text-sm font-black text-slate-100">{label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </Link>)}
      </div>
    </Section>
    <ActionsRapides actions={actions}/>
  </section>;
}
function Metric({icon: Icon, label, value}) { return <div className="rounded-2xl border border-slate-700 p-4"><Icon size={18} className="text-blue-300"/><p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-2xl font-black tracking-tight text-slate-50">{value}</p></div>; }
