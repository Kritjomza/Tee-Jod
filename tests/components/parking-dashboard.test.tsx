import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParkingDashboard } from "@/components/parking/parking-dashboard";

vi.mock("@/components/parking/parking-map", () => ({ ParkingMap: () => <div data-testid="parking-map" /> }));

const response = {
  lots: [
    { id: "student-lot", name: "CB2 Parking", capacity: 60, availableSpaces: 8, latitude: 13.6509586, longitude: 100.4928881, updatedAt: "2026-09-18T00:00:00.000Z" },
    { id: "stadium", name: "Sports Field Parking", capacity: 100, availableSpaces: 42, latitude: null, longitude: null, updatedAt: "2026-09-18T00:00:00.000Z" },
    { id: "fibo", name: "FIBO Parking", capacity: 200, availableSpaces: 127, latitude: 13.6543155, longitude: 100.4939698, updatedAt: "2026-09-18T00:00:00.000Z" },
    { id: "parking-building-1", name: "Parking Building 1", capacity: 366, availableSpaces: 19, latitude: 13.6503016, longitude: 100.4951975, updatedAt: "2026-09-18T00:00:00.000Z" },
  ],
  generatedAt: "2026-09-18T00:00:00.000Z",
  source: "prototype" as const,
};

it("shows three v2 locations and navigation, excluding old lot 2", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => response }));
  render(<ParkingDashboard />);
  expect(screen.getByTestId("parking-map")).toBeInTheDocument();
  expect(await screen.findByRole("heading", { level: 3, name: "จุดจอดรถ FIBO" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 3, name: /จุดจอดรถ CB2/ })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 3, name: "อาคารจอดรถ 1" })).toBeInTheDocument();
  expect(screen.queryByText("Sports Field Parking")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "นำทาง จุดจอดรถ FIBO" })).toHaveAttribute("href", expect.stringContaining("destination=13.6543155%2C100.4939698"));
  expect(screen.getAllByText(/รอยืนยันข้อมูล/)).toHaveLength(6);
});

it("switches visible text between Thai and English", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => response }));
  render(<ParkingDashboard />);
  await screen.findByRole("heading", { level: 3, name: "จุดจอดรถ FIBO" });
  await userEvent.click(screen.getByRole("button", { name: "EN" }));
  expect(screen.getByRole("heading", { level: 3, name: "FIBO Parking" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Parking map" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute("aria-pressed", "true");
});

it("offers retry after failed request", async () => {
  const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({ ok: true, json: async () => response });
  vi.stubGlobal("fetch", fetchMock);
  render(<ParkingDashboard />);
  expect(await screen.findByText("โหลดข้อมูลที่จอดรถไม่ได้")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "ลองอีกครั้ง" }));
  await waitFor(() => expect(screen.getByRole("heading", { level: 3, name: "จุดจอดรถ FIBO" })).toBeInTheDocument());
});
