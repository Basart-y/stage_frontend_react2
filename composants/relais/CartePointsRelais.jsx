"use client";

import dynamic from "next/dynamic";

const RelayMapContent = dynamic(
    () => import("./ContenuCartePointsRelais.jsx"),
    {
        ssr: false
    }
);

export default function CartePointRelais({
                                     relayPoints = [],
                                     selected,
                                     onSelect
                                 }) {
    return (
        <RelayMapContent
            relayPoints={relayPoints}
            selected={selected}
            onSelect={onSelect}
        />
    );
}