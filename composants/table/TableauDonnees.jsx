export default function TableauDonnees({columns, data, emptyMessage = "Aucun résultat à afficher."}) {
    return <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111b2b] shadow-[0_10px_32px_rgba(15,23,42,.045)]">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-slate-900/70">
                <tr>{columns.map((column) => <th key={column.key} className="border-b border-slate-800 px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-500">{column.label}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                {data.map((row) => <tr key={row.id} className="transition hover:bg-blue-500/10">{columns.map((column) => <td key={column.key} className="px-5 py-4 text-[13px] text-slate-200">{column.render ? column.render(row) : row[column.key]}</td>)}</tr>)}
                </tbody>
            </table>
        </div>
        {data.length === 0 && <div className="border-t border-slate-800 px-5 py-12 text-center text-sm text-slate-500">{emptyMessage}</div>}
    </div>;
}
