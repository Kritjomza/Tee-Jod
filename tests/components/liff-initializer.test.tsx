import { render, waitFor } from "@testing-library/react";
import { LiffInitializer } from "@/components/line/liff-initializer";
import { initializeLiff } from "@/lib/line/liff-client";

vi.mock("@/lib/line/liff-client", () => ({ initializeLiff: vi.fn().mockResolvedValue({ inClient: true }) }));

it("initializes LIFF when mounted", async () => {
  render(<LiffInitializer />);
  await waitFor(() => expect(initializeLiff).toHaveBeenCalledOnce());
});
