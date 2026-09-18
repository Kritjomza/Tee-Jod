import { validateAvailability } from "@/lib/admin/availability";

it("accepts an integer within capacity", () => {
  expect(validateAvailability(42, 100)).toEqual({ ok: true, value: 42 });
});

it.each([-1, 101, 4.5])("rejects invalid availability %s", (value) => {
  expect(validateAvailability(value, 100).ok).toBe(false);
});
