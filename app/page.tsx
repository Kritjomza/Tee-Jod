import Image from "next/image";
import { MapPin } from "lucide-react";
import { ParkingDashboard } from "@/components/parking/parking-dashboard";
import { LiffInitializer } from "@/components/line/liff-initializer";

export default function Home() {
  return (
    <main className="site-shell">
      <LiffInitializer />
      <header className="brand-header">
        <div className="brand-lockup">
          <div className="seal-wrap"><Image src="/kmutt-seal.png" alt="KMUTT seal" width={48} height={48} priority /></div>
          <div><p className="eyebrow">KMUTT SMART PARKING</p><h1>Tee-Jod <span>ที่จอด</span></h1></div>
        </div>
        <div className="campus-pill"><MapPin size={14} aria-hidden="true" /> Bangmod Campus</div>
      </header>
      <ParkingDashboard />
      <footer><span>Tee-Jod Prototype v1</span><span>Availability only — no reservations</span></footer>
    </main>
  );
}
