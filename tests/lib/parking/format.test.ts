import { buildDirectionsUrl, formatBangkokTime } from "@/lib/parking/format";
import type { ParkingLot } from "@/lib/parking/schema";

const baseLot: ParkingLot = {
  id: "fibo",
  name: "FIBO Parking",
  capacity: 200,
  availableSpaces: 127,
  latitude: null,
  longitude: null,
  updatedAt: "2026-09-18T00:00:00.000Z",
};

it("formats timestamps in Bangkok time", () => {
  expect(formatBangkokTime(baseLot.updatedAt)).toContain("07:00");
});

it("disables directions until coordinates are verified", () => {
  expect(buildDirectionsUrl(baseLot)).toBeNull();
  expect(buildDirectionsUrl({ ...baseLot, latitude: 13.651, longitude: 100.496 })).toContain("destination=13.651%2C100.496");
});
