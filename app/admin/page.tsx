import Link from "next/link";
import { ParkingControls } from "@/components/admin/parking-controls";
export const metadata={title:"Demo controls | Tee-Jod"};
export default function AdminPage(){return <main className="admin-shell"><header className="admin-header"><strong>Tee-Jod / Admin</strong><Link className="back-link" href="/">← Parking view</Link></header><section className="admin-intro"><h1>จัดการพื้นที่จอดรถ</h1><p>กำหนดจำนวนว่าง พื้นที่สำรอง ที่จอดผู้พิการ และแท่นชาร์จ พร้อมส่งประกาศความเสี่ยงไปยัง LINE OA</p></section><ParkingControls/></main>;}
