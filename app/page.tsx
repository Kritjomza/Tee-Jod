import { ParkingDashboard } from "@/components/parking/parking-dashboard";
import { LiffInitializer } from "@/components/line/liff-initializer";

export default function Home() {
  return (
    <main className="site-shell">
      <LiffInitializer />
      <ParkingDashboard />
    </main>
  );
}
