import { z } from "zod";
export const ParkingLotSchema = z.object({ id:z.string().min(1), name:z.string().min(1), capacity:z.number().int().positive(), availableSpaces:z.number().int().nonnegative(), latitude:z.number().min(-90).max(90).nullable(), longitude:z.number().min(-180).max(180).nullable(), updatedAt:z.string().datetime() }).refine((lot)=>lot.availableSpaces<=lot.capacity,{ message:"Available spaces cannot exceed capacity", path:["availableSpaces"] });
export const ParkingResponseSchema = z.object({ lots:z.array(ParkingLotSchema), generatedAt:z.string().datetime(), source:z.literal("prototype") });
export type ParkingLot = z.infer<typeof ParkingLotSchema>;
export type ParkingResponse = z.infer<typeof ParkingResponseSchema>;
export type ParkingStatus = "available"|"limited"|"full";
