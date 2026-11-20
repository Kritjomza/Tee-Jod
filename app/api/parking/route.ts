import { NextResponse } from "next/server";
import { listParkingLots } from "@/lib/parking/store";
import { publicAvailability } from "@/lib/parking/schema";
export const dynamic="force-dynamic";
export async function GET(){try{const lots=await listParkingLots();const publicLots=lots.map((lot)=>({...lot,availableSpaces:publicAvailability(lot)}));return NextResponse.json({lots:publicLots,generatedAt:new Date().toISOString(),source:"prototype"},{headers:{"Cache-Control":"no-store"}});}catch{return NextResponse.json({error:"Parking data is temporarily unavailable"},{status:503,headers:{"Cache-Control":"no-store"}});}}
