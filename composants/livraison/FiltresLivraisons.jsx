export default function FiltresLivraisons({status, setStatus}) {
    return <select value={status} onChange={(e) => setStatus(e.target.value)} className="min-w-48 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-200 outline-none transition hover:border-slate-600 focus:border-blue-500 focus:bg-[#111b2b] focus:ring-4 focus:ring-blue-500/10">
        <option value="">Tous les statuts</option>
        <option value="Créée">Créée</option>
        <option value="En transit">En transit</option>
        <option value="Arrivé au point relais">Arrivé au point relais</option>
        <option value="Retiré">Retiré</option>
        <option value="Retourné">Retourné</option>
    </select>;
}
