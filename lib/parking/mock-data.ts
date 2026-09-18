import type { ParkingLot } from "./schema";
const timestamp="2026-09-18T00:00:00.000Z";
export const seedParkingLots:ParkingLot[]=[
 {id:"student-lot",name:"Student Parking",capacity:60,availableSpaces:8,latitude:null,longitude:null,updatedAt:timestamp},
 {id:"stadium",name:"Sports Field Parking",capacity:100,availableSpaces:42,latitude:null,longitude:null,updatedAt:timestamp},
 {id:"fibo",name:"FIBO Parking",capacity:200,availableSpaces:127,latitude:null,longitude:null,updatedAt:timestamp},
 {id:"parking-building-1",name:"Parking Building 1",capacity:366,availableSpaces:19,latitude:null,longitude:null,updatedAt:timestamp},
];
