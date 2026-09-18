import type { ParkingLot,ParkingStatus } from "./schema";
export function getParkingStatus(lot:Pick<ParkingLot,"capacity"|"availableSpaces">):ParkingStatus { const ratio=lot.availableSpaces/lot.capacity; if(ratio>0.3)return "available"; if(ratio>=0.1)return "limited"; return "full"; }
export function getParkingStatusLabel(lot:Pick<ParkingLot,"capacity"|"availableSpaces">){ const status=getParkingStatus(lot); if(status==="available")return "Available"; if(status==="limited")return "Limited"; return lot.availableSpaces===0?"Full":"Nearly full"; }
export function sortParkingLots(lots:readonly ParkingLot[]){ return [...lots].sort((a,b)=>b.availableSpaces-a.availableSpaces||a.name.localeCompare(b.name)); }
