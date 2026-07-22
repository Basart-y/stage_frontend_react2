"use client";

import CarteAbonnement from "./CarteAbonnement.jsx";

export default function ListeAbonnements({subscriptions, current, onSelect}) {
    return (<div className="grid gap-6 md:grid-cols-3">
        {subscriptions.map((subscription) => (<CarteAbonnement
            key={subscription.id}
            subscription={subscription}
            current={current?.name === subscription.name}
            onSelect={onSelect}
        />))}
    </div>);
}