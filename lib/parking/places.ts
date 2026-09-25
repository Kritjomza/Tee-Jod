export type Language = "th" | "en";

// Verified parking coordinates supplied for Prototype v2.
export const parkingPlaces = [
  { id: "student-lot", number: "01", name: { th: "จุดจอดรถ CB2 (ลานกลางแจ้งข้างตึก GMI)", en: "CB2 Parking (outdoor lot beside GMI)" }, latitude: 13.6509586, longitude: 100.4928881 },
  { id: "fibo", number: "03", name: { th: "จุดจอดรถ FIBO", en: "FIBO Parking" }, latitude: 13.6543155, longitude: 100.4939698 },
  { id: "parking-building-1", number: "04", name: { th: "อาคารจอดรถ 1", en: "Parking Building 1" }, latitude: 13.6503016, longitude: 100.4951975 },
] as const;
