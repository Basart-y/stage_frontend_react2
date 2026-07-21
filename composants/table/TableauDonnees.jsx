export default function TableauDonnees({
                                      columns, data
                                  }) {
    return (<div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
                <thead className="bg-slate-900">
                <tr>
                    {columns.map((column) => (<th
                            key={column.key}
                            className="text-left px-5 py-4 text-slate-400"
                        >
                            {column.label}
                        </th>))}
                </tr>
                </thead>

                <tbody>
                {data.map((row) => (<tr
                        key={row.id}
                        className="border-t border-slate-800"
                    >
                        {columns.map((column) => (<td
                                key={column.key}
                                className="px-5 py-4"
                            >
                                {column.render ? column.render(row) : row[column.key]}
                            </td>))}
                    </tr>))}
                </tbody>
            </table>
        </div>);
}