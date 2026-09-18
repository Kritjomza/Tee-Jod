import { parseParkingIntent } from "@/lib/line/intents";

it.each(["parking", "ที่จอด", "ว่างไหม", "FIBO", "สนามกีฬา"])("recognizes %s as parking intent", (text) => {
  expect(parseParkingIntent(text)).toBe("parking");
});

it("falls back to help", () => {
  expect(parseParkingIntent("hello there")).toBe("help");
});
