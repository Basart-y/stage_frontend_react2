import Button from "./Button";

export default function Pagination() {
    return (
        <div className="flex items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
            <p className="text-sm text-slate-400">Affichage 1 à 10 sur 48</p>
            <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">Précédent</Button>
                <Button variant="secondary" size="sm">Suivant</Button>
            </div>
        </div>
    );
}
{/* Naviguer entre plusieurs pages de résultats */}