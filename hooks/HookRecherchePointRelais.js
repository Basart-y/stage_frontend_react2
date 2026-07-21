
"use client";

import {useState} from "react";
import servicePointRelais from "@/services/ServicePointRelais.js";

const MAX_RESULTS = 100;
const MAX_RETURNED = 50;

export default function hookRecherchePointRelais() {
    const [relayPoints, setRelayPoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Calcul de distance (Haversine)
    function distance(lat1, lon1, lat2, lon2) {
        const R = 6371;

        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;

        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    async function search(filters) {
        try {
            setLoading(true);
            setError(null);

            const result = await servicePointRelais.search(filters);

            let points = Array.isArray(result) ? result : [];

            // Limite de sécurité
            points = points.slice(0, MAX_RESULTS);

            if (points.length > 0) {
                const center = {
                    lat: Number(points[0].latitude), lng: Number(points[0].longitude),
                };

                points = [...points].sort((a, b) => {
                    const distA = distance(center.lat, center.lng, Number(a.latitude), Number(a.longitude));

                    const distB = distance(center.lat, center.lng, Number(b.latitude), Number(b.longitude));

                    return distA - distB;
                });
            }

            setRelayPoints(points.slice(0, MAX_RETURNED));
        } catch (err) {
            console.error(err);
            setRelayPoints([]);
            setError("Impossible de charger les points relais.");
        } finally {
            setLoading(false);
        }
    }

    return {
        relayPoints, loading, error, search,
    };
}