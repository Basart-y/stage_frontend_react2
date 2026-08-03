"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {MapPin, RefreshCw} from "lucide-react";

const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

function validCoordinate(relay) {
  const lat = Number(relay.latitude);
  const lng = Number(relay.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && !(lat === 0 && lng === 0);
}

function loadLeaflet() {
  if (typeof window === "undefined") return Promise.reject(new Error("Navigateur indisponible"));
  if (window.L) return Promise.resolve(window.L);
  if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L), {once: true});
      existing.addEventListener("error", () => reject(new Error("Leaflet indisponible")), {once: true});
      return;
    }
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Impossible de charger la carte"));
    document.body.appendChild(script);
  });
}

export default function CarteInteractivePointsRelais({relays = [], selectedId, onSelect}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapError, setMapError] = useState("");
  const mappedRelays = useMemo(() => relays.filter(validCoordinate), [relays]);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !containerRef.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {scrollWheelZoom: false}).setView([46.603354, 1.888334], 5);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapRef.current);
      }
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (!mappedRelays.length) return;
      const bounds = [];
      mappedRelays.forEach((relay) => {
        const selected = String(relay.id) === String(selectedId);
        const marker = L.circleMarker([Number(relay.latitude), Number(relay.longitude)], {
          radius: selected ? 11 : 8,
          color: selected ? "#1d4ed8" : "#4338ca",
          fillColor: selected ? "#2563eb" : "#6366f1",
          fillOpacity: 0.9,
          weight: selected ? 4 : 2,
        }).addTo(mapRef.current);
        marker.bindTooltip(`<strong>${String(relay.name || "Point relais")}</strong><br>${String(relay.address || "")} ${String(relay.city || "")}`, {direction: "top"});
        marker.on("click", () => onSelect?.(relay));
        markersRef.current.push(marker);
        bounds.push([Number(relay.latitude), Number(relay.longitude)]);
      });
      if (bounds.length === 1) mapRef.current.setView(bounds[0], 14);
      else mapRef.current.fitBounds(bounds, {padding: [35, 35], maxZoom: 14});
      setTimeout(() => mapRef.current?.invalidateSize(), 0);
    }).catch(() => !cancelled && setMapError("La carte OpenStreetMap n’a pas pu être chargée. La sélection par liste reste disponible."));
    return () => { cancelled = true; };
  }, [mappedRelays, selectedId, onSelect]);

  useEffect(() => () => {
    markersRef.current.forEach((marker) => marker.remove());
    mapRef.current?.remove();
    mapRef.current = null;
  }, []);

  if (!relays.length) return null;
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
      <div className="flex items-center gap-2"><MapPin size={17} className="text-indigo-700"/><p className="text-sm font-bold text-slate-900">Carte des points relais</p></div>
      <p className="text-xs text-slate-600">Cliquez sur un marqueur pour sélectionner le relais</p>
    </div>
    {mapError ? <div className="flex items-center gap-2 p-5 text-sm text-amber-800"><RefreshCw size={16}/>{mapError}</div> : <div ref={containerRef} className="h-[360px] w-full" aria-label="Carte interactive des points relais"/>}
    {mappedRelays.length < relays.length && <p className="border-t border-slate-200 px-4 py-2 text-xs text-slate-600">{relays.length - mappedRelays.length} point(s) relais sans coordonnées valides ne sont pas affichés sur la carte.</p>}
  </div>;
}
