import {CheckCircle2, Clock3, Gauge, Radio} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import GrillesStatistiques from "@/composants/TableauDeBord/GrillesStatistiques.jsx";
import ActionsRapides from "@/composants/TableauDeBord/ActionsRapides.jsx";

const stats = [{label: "Colis en attente", value: 12}, {label: "Reçus aujourd'hui", value: 8}, {label: "Retirés", value: 20}, {label: "Occupation", value: "64%"}];
const actions = [
    {label: "Réception colis", href: "/point-relais/reception", description: "Scanner ou saisir une référence de colis"},
    {label: "Remise client", href: "/point-relais/retrait", description: "Identifier le client et confirmer le retrait"},
    {label: "Retour colis", href: "/point-relais/retour", description: "Traiter les demandes de retour commerçant"}
];

export default function PointRelaisDashboardPage() {
    return <section className="space-y-8">
        <PageTitle title="Point relais — opérations du jour" description="Réceptionnez, stockez, remettez et retournez les colis depuis un écran opérationnel."/>
        <GrillesStatistiques stats={stats}/>
        <div className="grid gap-6 xl:grid-cols-2">
            <Section title="Capacité de stockage" description="Vue instantanée utile pour décider si le relais peut encore recevoir des colis.">
                <div className="flex items-center gap-5"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-700"><Gauge size={24}/></span><div className="flex-1"><div className="flex items-end justify-between"><p className="font-bold text-slate-900">64 colis / 100 places</p><p className="text-xs font-bold text-indigo-700">36 places libres</p></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[64%] rounded-full bg-gradient-to-r from-blue-600 to-indigo-400"/></div></div></div>
            </Section>
            <Section title="État du relais" description="Informations visibles immédiatement pendant la démo.">
                <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-indigo-500/10 p-4"><Radio size={17} className="text-indigo-700"/><p className="mt-3 text-xs font-bold uppercase tracking-wide text-indigo-700">Statut</p><p className="mt-1 font-extrabold text-indigo-800">Ouvert</p></div><div className="rounded-2xl bg-slate-50 p-4"><Clock3 size={17} className="text-slate-700"/><p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-600">Fermeture</p><p className="mt-1 font-extrabold text-slate-900">19:00</p></div><div className="rounded-2xl bg-blue-500/10 p-4"><CheckCircle2 size={17} className="text-blue-700"/><p className="mt-3 text-xs font-bold uppercase tracking-wide text-blue-700">Service</p><p className="mt-1 font-extrabold text-blue-800">Normal</p></div></div>
            </Section>
        </div>
        <div><p className="rf-kicker">Opérations</p><h2 className="mb-4 mt-1 text-lg font-black tracking-tight text-slate-950">Actions rapides</h2><ActionsRapides actions={actions}/></div>
    </section>;
}
