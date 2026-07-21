"use client";


import {useEffect, useState} from "react";


import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";

import ListeAbonnements from "@/composants/abonnement/ListeAbonnements.jsx";

import serviceAbonnement from "@/services/ServiceAbonnement.js";


export default function AbonnementPage() {


    const [subscriptions, setSubscriptions] = useState([]);


    const [current, setCurrent] = useState(null);


    useEffect(() => {


        serviceAbonnement
            .getSubscriptions()
            .then(setSubscriptions);


        serviceAbonnement
            .getCurrentSubscription()
            .then(setCurrent);


    }, []);


    async function handleSelect(subscription) {


        const updated = await serviceAbonnement
            .createSubscription(subscription);


        setCurrent(updated);


    }


    return (

        <div className="space-y-8">


            <PageTitle

                title="Mon abonnement"

                description="
                Gérez votre formule.
                "

            />


            <Section title="Abonnement actuel">


                {current &&

                    <div>

                        <p>
                            Offre :
                            <strong>
                                {" "}
                                {current.name}
                            </strong>
                        </p>


                        <p>
                            Statut :
                            {" "}
                            {current.status || "Actif"}
                        </p>


                    </div>

                }


            </Section>


            <Section title="Changer d'offre">


                <ListeAbonnements

                    subscriptions={subscriptions}

                    current={current}

                    onSelect={handleSelect}

                />


            </Section>


        </div>

    );

}