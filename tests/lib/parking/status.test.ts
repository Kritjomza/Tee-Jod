import { getParkingStatus, sortParkingLots } from "@/lib/parking/status";
import type { ParkingLot } from "@/lib/parking/schema";

const lot = (id: string, availableSpaces: number, capacity = 100): ParkingLot => ({
  id,
  name: id,
  capacity,
  availableSpaces,
  latitude: null,
  longitude: null,
  updatedAt: "2026-09-18T00:00:00.000Z",
});

describe("parking status", () => {
  it("uses the availability thresholds", () => {
    expect(getParkingStatus(lot("open", 31))).toBe("available");
    expect(getParkingStatus(lot("limited", 30))).toBe("limited");
    expect(getParkingStatus(lot("full", 9))).toBe("full");
  });

  it("sorts by free spaces without mutating the source", () => {
    const source = [lot("student", 8), lot("fibo", 127, 200), lot("stadium", 42)];
    expect(sortParkingLots(source).map((item) => item.id)).toEqual(["fibo", "stadium", "student"]);
    expect(source.map((item) => item.id)).toEqual(["student", "fibo", "stadium"]);
  });
});
