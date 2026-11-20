"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { ParkingLot } from "@/lib/parking/schema";

type Notice = { type: "error" | "success"; text: string } | null;

export function ParkingControls() {
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState<Notice>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const load = useCallback(async () => {
    const response = await fetch("/api/parking", { cache: "no-store" });
    if (!response.ok) throw new Error();
    const data = await response.json();
    setLots(data.lots.map((lot: ParkingLot) => ({ ...lot, availableSpaces: lot.availableSpaces + lot.reservedSpaces })));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load().catch(() => setMessage({ type: "error", text: "Could not load parking data." })), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function update(lot: ParkingLot, updates: Partial<ParkingLot>, sendAlert = false) {
    if (!pin) return setMessage({ type: "error", text: "Enter the admin PIN first." });
    setBusyId(lot.id);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/parking/${lot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, sendAlert, pin }),
      });
      const body = await response.json();
      if (!response.ok) {
        if (body.lot) setLots((current) => current.map((item) => item.id === lot.id ? body.lot : item));
        setMessage({ type: "error", text: body.error ?? "Update failed." });
      }
      else {
        setLots((current) => current.map((item) => item.id === lot.id ? body : item));
        setMessage({ type: "success", text: sendAlert ? "บันทึกและส่งแจ้งเตือนผ่าน LINE OA แล้ว" : `${lot.name} updated.` });
      }
    } catch {
      setMessage({ type: "error", text: "Could not save changes. Check your connection and try again." });
    } finally {
      setBusyId(null);
    }
  }

  function submitSettings(event: FormEvent<HTMLFormElement>, lot: ParkingLot) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void update(lot, {
      availableSpaces: Number(data.get("availableSpaces")),
      reservedSpaces: Number(data.get("reservedSpaces")),
      accessibleSpaces: Number(data.get("accessibleSpaces")),
      evChargerSpaces: Number(data.get("evChargerSpaces")),
    });
  }

  function submitWarning(event: FormEvent<HTMLFormElement>, lot: ParkingLot) {
    event.preventDefault();
    const warning = String(new FormData(event.currentTarget).get("warning") ?? "").trim();
    if (!warning) return setMessage({ type: "error", text: "กรุณาพิมพ์ข้อความแจ้งเตือน" });
    void update(lot, { warning }, true);
  }

  return <>
    <div className="pin-panel"><label htmlFor="admin-pin">รหัส PIN ผู้ดูแล</label><input id="admin-pin" type="password" autoComplete="current-password" value={pin} onChange={(event) => setPin(event.target.value)} placeholder="ใส่ PIN เพื่อบันทึกการเปลี่ยนแปลง"/></div>
    {message && <p role="status" className={`notice notice-${message.type}`}>{message.text}</p>}
    <section className="admin-grid" aria-label="ตั้งค่าพื้นที่จอดรถ">{lots.map((lot) => <article className="admin-card" key={lot.id}>
      <h2>{lot.name}</h2>
      <p>จำนวนว่างก่อนหักพื้นที่สำรอง <strong>{lot.availableSpaces}</strong> จาก {lot.capacity} ช่อง</p>
      <form className="admin-settings-form" onSubmit={(event) => submitSettings(event, lot)}>
        <label>จำนวนที่ว่างรวม<input name="availableSpaces" type="number" min="0" max={lot.capacity} defaultValue={lot.availableSpaces} inputMode="numeric" required/></label>
        <label>พื้นที่สำรอง<input name="reservedSpaces" type="number" min="0" max={lot.capacity} defaultValue={lot.reservedSpaces} inputMode="numeric" required/></label>
        <label>ที่จอดผู้พิการ<input name="accessibleSpaces" type="number" min="0" max={lot.capacity} defaultValue={lot.accessibleSpaces} inputMode="numeric" required/></label>
        <label>แท่นชาร์จรถไฟฟ้า<input name="evChargerSpaces" type="number" min="0" max={lot.capacity} defaultValue={lot.evChargerSpaces} inputMode="numeric" required/></label>
        <p className="admin-public-count">หน้าเว็บและ LINE จะแสดง <strong>{Math.max(0, lot.availableSpaces - lot.reservedSpaces)}</strong> ช่องสำหรับบุคคลทั่วไป</p>
        <button className="admin-save-button" disabled={busyId === lot.id}>{busyId === lot.id ? "กำลังบันทึก…" : "บันทึกจำนวน"}</button>
      </form>
      <form className="risk-form" onSubmit={(event) => submitWarning(event, lot)}>
        <label htmlFor={`warning-${lot.id}`}>แจ้งเตือนความเสี่ยง</label>
        <textarea id={`warning-${lot.id}`} name="warning" maxLength={500} defaultValue={lot.warning ?? ""} placeholder="เช่น น้ำท่วมบริเวณทางเข้าลานจอด" rows={3}/>
        <div className="risk-actions"><button className="admin-alert-button" disabled={busyId === lot.id}>{busyId === lot.id ? "กำลังส่ง…" : "บันทึกและส่ง LINE OA"}</button>{lot.warning && <button type="button" className="clear-alert-button" disabled={busyId === lot.id} onClick={() => void update(lot, { warning: null })}>ล้างประกาศ</button>}</div>
        {lot.warning && <p className="active-alert">ประกาศหน้าเว็บ: {lot.warning}</p>}
      </form>
    </article>)}</section>
  </>;
}
