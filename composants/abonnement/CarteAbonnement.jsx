"use client";

export default function CarteAbonnement({
                                            subscription, current, onSelect
                                        }) {
    return (<div className={`rounded-xl border p-6 space-y-4 ${current ? "border-green-500 bg-green-500/10" : "border-slate-700"}`}
    >
        <h3 className="text-xl font-bold">
            {subscription.name}
        </h3>

        <p className="text-slate-400">
            {subscription.description}
        </p>

        <p>
                <span className="text-2xl font-bold">
                    {subscription.price}€
                </span>
            /mois
        </p>

        <p>
            Limite :
            <strong>
                {" "}
                {subscription.limit} colis/mois
            </strong>
        </p>

        {current ? (<span className="text-green-400">
                    Abonnement actuel
                </span>) : (<button
            onClick={() => onSelect(subscription)}
            className="rounded-lg bg-blue-600 px-5 py-2"
        >
            Choisir
        </button>)}
    </div>);
}