"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ArrowUpRight, MapPin, RefreshCw } from "lucide-react";
import { ParkingResponseSchema, type ParkingLot } from "@/lib/parking/schema";
import { buildDirectionsUrl, formatBangkokTime } from "@/lib/parking/format";
import { sortParkingLots } from "@/lib/parking/status";
import { parkingPlaces, type Language } from "@/lib/parking/places";
import { ParkingMap } from "./parking-map";

type ViewState = { kind: "loading" } | { kind: "error" } | { kind: "ready"; lots: ParkingLot[] };
const copy = {
  th: { campus: "วิทยาเขตบางมด", map: "แผนที่จุดจอดรถ", mapNote: "เลือกหมุดเพื่อดูรายละเอียด", available: "ที่ว่าง", capacity: "ความจุ", hours: "เวลาเปิด", fee: "ค่าจอด", unknown: "รอยืนยันข้อมูล", navigate: "นำทาง", areas: "จุดจอดรถทั้งหมด", spaces: "ที่ว่างทั่ววิทยาเขต", updated: "อัปเดต", refresh: "รีเฟรชข้อมูล", prototype: "ข้อมูลต้นแบบ ไม่ใช่ข้อมูลเรียลไทม์", best: "จุดจอดที่ว่างมากที่สุด", loading: "กำลังโหลดข้อมูลที่จอดรถ…", error: "โหลดข้อมูลที่จอดรถไม่ได้", retry: "ลองอีกครั้ง", empty: "ยังไม่มีข้อมูลจุดจอดรถ", footer: "จำนวนว่างหักพื้นที่สำรองแล้ว", accessible: "ที่จอดผู้พิการ", ev: "แท่นชาร์จรถไฟฟ้า", warning: "แจ้งเตือนความเสี่ยง", reserved: "พื้นที่สำรอง", liveWarning: "โปรดระวังบริเวณนี้", allReserved: "พื้นที่ว่างสำหรับผู้ใช้ทั่วไป" },
  en: { campus: "Bangmod Campus", map: "Parking map", mapNote: "Select a pin to view details", available: "spaces free", capacity: "Capacity", hours: "Hours", fee: "Parking fee", unknown: "Not confirmed", navigate: "Navigate", areas: "All parking areas", spaces: "spaces across campus", updated: "Updated", refresh: "Refresh availability", prototype: "Prototype data — not real-time", best: "Most spaces available", loading: "Checking parking availability…", error: "Could not load parking data", retry: "Try again", empty: "No parking areas are configured", footer: "Availability excludes reserved spaces", accessible: "Accessible spaces", ev: "EV chargers", warning: "Risk alert", reserved: "reserved", liveWarning: "Please use caution in this area", allReserved: "spaces available to visitors" },
} as const;

export function ParkingDashboard() {
  const [language, setLanguage] = useState<Language>("th");
  const [state, setState] = useState<ViewState>({ kind: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState("student-lot");
  const t = copy[language];
  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await fetch("/api/parking", { cache: "no-store" });
      if (!response.ok) throw new Error("Request failed");
      const parsed = ParkingResponseSchema.parse(await response.json());
      setState({ kind: "ready", lots: sortParkingLots(parsed.lots.filter((lot) => parkingPlaces.some((place) => place.id === lot.id))) });
    } catch { setState({ kind: "error" }); }
    finally { setRefreshing(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const lots = state.kind === "ready" ? state.lots : [];
  const publicLots = lots;
  const bestLot = publicLots[0];

  return <>
    <header className="brand-header"><div className="brand-lockup"><div className="seal-wrap"><Image src="/kmutt-seal.png" alt="KMUTT seal" width={48} height={48} preload /></div><div><p className="brand-context">KMUTT parking</p><h1>Tee-Jod <span>ที่จอด</span></h1></div></div><div className="header-actions"><div className="campus-pill"><MapPin size={14} aria-hidden="true" /> {t.campus}</div><div className="language-toggle" role="group" aria-label="Language"><button type="button" onClick={() => setLanguage("th")} aria-pressed={language === "th"}>ไทย</button><button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"}>EN</button></div></div></header>
    {lots.some((lot) => lot.warning) && <section className="risk-alerts" aria-label={t.warning}><h2>{t.warning}</h2>{lots.filter((lot) => lot.warning).map((lot) => <p key={lot.id}><strong>{parkingPlaces.find((place) => place.id === lot.id)?.name[language] ?? lot.name}</strong> — {lot.warning}</p>)}</section>}
    <section className="map-section" aria-labelledby="map-heading"><div className="section-heading map-heading"><h2 id="map-heading">{t.map}</h2><p>{t.mapNote}</p></div><ParkingMap selectedId={selectedId} onSelect={setSelectedId} language={language} /></section>
    {state.kind === "loading" ? <section aria-label={t.loading}><p className="section-heading">{t.loading}</p><div className="parking-list"><div className="skeleton"/><div className="skeleton"/></div></section> : null}
    {state.kind === "error" ? <section className="state-card" role="alert"><div><span className="state-icon"><AlertTriangle aria-hidden="true"/></span><h2>{t.error}</h2><button className="retry-button" onClick={() => void load()}>{t.retry}</button></div></section> : null}
    {state.kind === "ready" && !bestLot ? <section className="state-card">{t.empty}</section> : null}
    {bestLot ? <><section className="hero-card"><div className="hero-top"><div><p className="prototype-label"><span className="pulse"/> {t.prototype}</p><h2>{parkingPlaces.find((place) => place.id === bestLot.id)?.name[language] ?? bestLot.name}</h2><p className="hero-kicker">{t.best}</p></div><button className="refresh-button" onClick={() => void load(true)} disabled={refreshing} aria-label={t.refresh}><RefreshCw size={18} className={refreshing ? "spin" : ""} aria-hidden="true"/></button></div><div className="hero-count"><strong>{bestLot.availableSpaces}</strong><span>{t.available}</span></div><p className="hero-meta">{t.updated} {formatBangkokTime(bestLot.updatedAt)}</p></section><div className="section-heading"><h2>{t.areas}</h2><p>{publicLots.reduce((sum, lot) => sum + lot.availableSpaces, 0)} {t.spaces}</p></div><section className="parking-list" aria-label={t.areas}>{publicLots.map((lot) => { const place = parkingPlaces.find((item) => item.id === lot.id)!; const url = buildDirectionsUrl(place); return <article className={`parking-card ${selectedId === lot.id ? "parking-card-selected" : ""}`} key={lot.id}><div className="card-top"><div className="lot-title"><h3>{place.name[language]}</h3><p>{t.capacity} {lot.capacity}</p></div><span className="lot-number">{place.number}</span></div><div className="availability-row"><div className="availability-count"><strong>{lot.availableSpaces}</strong> <span>{t.available}</span></div><a className="navigate-link" href={url!} target="_blank" rel="noreferrer" aria-label={`${t.navigate} ${place.name[language]}`}>{t.navigate} <ArrowUpRight size={15} aria-hidden="true"/></a></div><div className="lot-details"><span>{t.accessible}: {lot.accessibleSpaces}</span><span>{t.ev}: {lot.evChargerSpaces}</span></div><div className="card-foot"><span>{t.updated} {formatBangkokTime(lot.updatedAt)}</span><button type="button" onClick={() => setSelectedId(lot.id)}>{t.map}</button></div></article>; })}</section></> : null}
    <footer><span>Tee-Jod Prototype v2</span><span>{t.footer}</span></footer>
  </>;
}
