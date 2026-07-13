export default function Table({ columns, data, renderRow }) {
    return (
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => renderRow(item, index))} {/*Définit la ligne avec l'attribut a l'index indiqué */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
{/* Afficher des données sous forme de tableau, pour pouvoir réutiliser le même style de tableau partout */}