import Link from "next/link";
import { ParkingControls } from "@/components/admin/parking-controls";
export const metadata={title:"Demo controls | Tee-Jod"};
export default function AdminPage(){return <main className="admin-shell"><header className="admin-header"><strong>Tee-Jod / Demo Control</strong><Link className="back-link" href="/">← Parking view</Link></header><section className="admin-intro"><p className="eyebrow">PROTOTYPE OPERATIONS</p><h1>Parking availability controls</h1><p>Adjust mock space counts during demonstrations. Changes are temporary in local mock mode and persistent after Supabase is connected.</p></section><ParkingControls/></main>;}
