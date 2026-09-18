import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParkingDashboard } from "@/components/parking/parking-dashboard";

const response = {
  lots: [
    { id: "student-lot", name: "Student Parking", capacity: 60, availableSpaces: 8, latitude: null, longitude: null, updatedAt: "2026-09-18T00:00:00.000Z" },
    { id: "fibo", name: "FIBO Parking", capacity: 200, availableSpaces: 127, latitude: 13.651, longitude: 100.496, updatedAt: "2026-09-18T00:00:00.000Z" },
  ],
  generatedAt: "2026-09-18T00:00:00.000Z",
  source: "prototype" as const,
};

it("shows sorted availability and the prototype disclaimer", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => response }));
  render(<ParkingDashboard />);
  expect(screen.getByText(/checking parking/i)).toBeInTheDocument();
  expect(await screen.findByRole("heading", { level: 3, name: "FIBO Parking" })).toBeInTheDocument();
  const headings = screen.getAllByRole("heading", { level: 3 });
  expect(headings[0]).toHaveTextContent("FIBO Parking");
  expect(screen.getByText(/prototype data/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /navigate to fibo/i })).toHaveAttribute("href", expect.stringContaining("google.com/maps"));
});

it("offers retry after a failed request", async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce({ ok: false, json: async () => ({}) })
    .mockResolvedValueOnce({ ok: true, json: async () => response });
  vi.stubGlobal("fetch", fetchMock);
  render(<ParkingDashboard />);
  expect(await screen.findByText(/could not load/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /try again/i }));
  await waitFor(() => expect(screen.getByRole("heading", { level: 3, name: "FIBO Parking" })).toBeInTheDocument());
});

it("announces refresh progress through the refresh control", async () => {
  let resolveRefresh!: (value: unknown) => void;
  const fetchMock = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => response })
    .mockImplementationOnce(() => new Promise((resolve) => { resolveRefresh = resolve; }));
  vi.stubGlobal("fetch", fetchMock);

  render(<ParkingDashboard />);
  await screen.findByRole("heading", { level: 3, name: "FIBO Parking" });

  await userEvent.click(screen.getByRole("button", { name: /refresh parking availability/i }));

  expect(screen.getByRole("button", { name: /refreshing availability/i })).toBeDisabled();
  await act(async () => {
    resolveRefresh({ ok: true, json: async () => response });
  });
});
