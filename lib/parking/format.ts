import type { ParkingLot } from "./schema";
export function formatBangkokTime(iso:string){ return new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Bangkok",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(iso)); }
export function buildDirectionsUrl(lot:Pick<ParkingLot,"latitude"|"longitude">){ if(lot.latitude==null||lot.longitude==null)return null; const params=new URLSearchParams({api:"1",destination:`${lot.latitude},${lot.longitude}`,travelmode:"driving"}); return `https://www.google.com/maps/dir/?${params.toString()}`; }
