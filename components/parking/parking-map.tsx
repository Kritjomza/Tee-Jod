"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Navigation2 } from "lucide-react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { parkingPlaces, type Language } from "@/lib/parking/places";
import { buildDirectionsUrl } from "@/lib/parking/format";

export function ParkingMap({ selectedId, onSelect, language }: { selectedId: string; onSelect: (id: string) => void; language: Language }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const onSelectRef = useRef(onSelect);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  const selectedIdRef = useRef(selectedId);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  useEffect(() => {
    let disposed = false;
    let map: LeafletMap | null = null;
    const markers = markersRef.current;
    async function createMap() {
      const L = await import("leaflet");
      if (disposed || !elementRef.current || mapRef.current) return;
      map = L.map(elementRef.current, { scrollWheelZoom: false, zoomControl: false });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      parkingPlaces.forEach((place, index) => {
        const icon = L.divIcon({ className: "parking-marker-wrap", html: `<span class="parking-marker" style="--pin-order:${index}"><span>${place.number}</span></span>`, iconSize: [44, 52], iconAnchor: [22, 49] });
        const marker = L.marker([place.latitude, place.longitude], { icon, title: place.name.en, keyboard: true }).addTo(map!).on("click", () => onSelectRef.current(place.id));
        markers.set(place.id, marker);
      });
      map.fitBounds(L.latLngBounds(parkingPlaces.map((place) => [place.latitude, place.longitude] as [number, number])), { padding: [42, 42], maxZoom: 16 });
      markers.get(selectedIdRef.current)?.getElement()?.classList.add("is-selected");
    }
    void createMap();
    return () => { disposed = true; map?.remove(); mapRef.current = null; markers.clear(); };
  }, []);

  useEffect(() => {
    const place = parkingPlaces.find((item) => item.id === selectedId);
    markersRef.current.forEach((marker, id) => marker.getElement()?.classList.toggle("is-selected", id === selectedId));
    if (place && mapRef.current) mapRef.current.panTo([place.latitude, place.longitude], { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches, duration: 0.4 });
  }, [selectedId]);

  const selectedPlace = parkingPlaces.find((place) => place.id === selectedId) ?? parkingPlaces[0];
  return <div className="map-frame"><div className="map-canvas"><div ref={elementRef} className="parking-map" role="img" aria-label={language === "th" ? "แผนที่จุดจอดรถ 3 จุด" : "Map of three parking locations"} /><span className="map-corner-label" aria-hidden="true">KMUTT · BANGMOD</span></div><div className="map-legend" aria-label={language === "th" ? "เลือกจุดจอดรถ" : "Select parking area"}>{parkingPlaces.map((place) => <button className={selectedId === place.id ? "active" : ""} key={place.id} onClick={() => onSelect(place.id)} type="button" aria-pressed={selectedId === place.id}><span>{place.number}</span>{place.name[language]}</button>)}</div><div className="map-selection" aria-live="polite"><div className="map-selection-copy"><span className="map-selection-icon"><Navigation2 size={18} aria-hidden="true" /></span><div><p>{language === "th" ? "จุดจอดที่เลือก" : "Selected parking"}</p><strong>{selectedPlace.name[language]}</strong></div></div><a href={buildDirectionsUrl(selectedPlace)!} target="_blank" rel="noreferrer" aria-label={`${language === "th" ? "นำทางจากแผนที่ไป" : "Navigate from map to"} ${selectedPlace.name[language]}`}>{language === "th" ? "นำทาง" : "Directions"}<ArrowUpRight size={16} aria-hidden="true" /></a></div></div>;
}
