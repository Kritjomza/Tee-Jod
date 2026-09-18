import { getParkingStatus,getParkingStatusLabel } from "@/lib/parking/status";
import type { ParkingLot } from "@/lib/parking/schema";
export function StatusBadge({lot}:{lot:ParkingLot}){ const status=getParkingStatus(lot); return <span className={`status-badge status-${status}`}>{getParkingStatusLabel(lot)}</span>; }
