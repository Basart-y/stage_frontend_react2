"use client";

import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import SelectionPointRelais from "@/composants/relais/SelectionPointRelais.jsx";

export default function CommercantPointsRelaisPage() {
    return <div className="space-y-6">
        <PageTitle title="Points relais" description="Recherchez les points relais disponibles selon vos critères et sélectionnez celui qui vous convient."/>
        <Section title="Rechercher dans le réseau">
            <SelectionPointRelais/>
        </Section>
    </div>;
}
