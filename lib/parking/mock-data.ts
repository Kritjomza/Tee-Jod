import type { ParkingLot } from "./schema";
const timestamp="2026-09-18T00:00:00.000Z";
export const seedParkingLots:ParkingLot[]=[
 {id:"student-lot",name:"CB2 Parking (outdoor lot beside GMI)",capacity:60,availableSpaces:8,reservedSpaces:0,accessibleSpaces:2,evChargerSpaces:0,warning:null,latitude:13.6509586,longitude:100.4928881,updatedAt:timestamp},
 {id:"fibo",name:"FIBO Parking",capacity:200,availableSpaces:127,reservedSpaces:0,accessibleSpaces:4,evChargerSpaces:6,warning:null,latitude:13.6543155,longitude:100.4939698,updatedAt:timestamp},
 {id:"parking-building-1",name:"Parking Building 1",capacity:366,availableSpaces:19,reservedSpaces:0,accessibleSpaces:6,evChargerSpaces:4,warning:null,latitude:13.6503016,longitude:100.4951975,updatedAt:timestamp},
];
