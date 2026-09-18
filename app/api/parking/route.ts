import { NextResponse } from "next/server";
import { listParkingLots } from "@/lib/parking/store";
export const dynamic="force-dynamic";
export async function GET(){try{const lots=await listParkingLots();return NextResponse.json({lots,generatedAt:new Date().toISOString(),source:"prototype"},{headers:{"Cache-Control":"no-store"}});}catch{return NextResponse.json({error:"Parking data is temporarily unavailable"},{status:503,headers:{"Cache-Control":"no-store"}});}}
