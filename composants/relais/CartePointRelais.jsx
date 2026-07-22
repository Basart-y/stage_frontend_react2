"use client";

export default function CartePointRelais({relay, selected, onClick}) {
    return (<div
            className={`rounded-xl border p-4 space-y-3 ${selected ? "border-green-500 bg-green-900/20" : "border-slate-700 bg-slate-900"}`}
        >
            <div>
                <h3 className="font-semibold">
                    {relay.name}
                </h3>

                <p className="text-sm text-slate-400">
                    {relay.address}
                </p>

                <p className="text-sm">
                    {relay.postalCode} {relay.city}
                </p>
            </div>

            <button
                onClick={onClick}
                className={`w-full rounded-lg px-4 py-2 ${selected ? "bg-green-700" : "bg-blue-600"}`}
            >
                {selected ? "Relais sélectionné ✓" : "Sélectionner ce relais"}
            </button>
        </div>);
}