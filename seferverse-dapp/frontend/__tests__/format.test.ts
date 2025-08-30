import { describe, test, expect } from "vitest";
import { getExplorerTxUrl, getExplorerAddressUrl } from "../src/utils/format";

describe("explorer url helpers", () => {
  test("uses override base when provided (tx)", () => {
    const prev = process.env.NEXT_PUBLIC_EXPLORER_BASE;
    process.env.NEXT_PUBLIC_EXPLORER_BASE = "https://custom.explorer";
    expect(getExplorerTxUrl("baseSepolia", "0xabc")).toBe("https://custom.explorer/tx/0xabc");
    process.env.NEXT_PUBLIC_EXPLORER_BASE = prev;
  });

  test("uses network heuristics when no override (tx)", () => {
    const prev = process.env.NEXT_PUBLIC_EXPLORER_BASE;
    delete process.env.NEXT_PUBLIC_EXPLORER_BASE;
    expect(getExplorerTxUrl("baseSepolia", "0xabc")).toContain("sepolia.basescan.org/tx/0xabc");
    expect(getExplorerTxUrl("base", "0xabc")).toContain("basescan.org/tx/0xabc");
    expect(getExplorerTxUrl("ethereum", "0xabc")).toContain("etherscan.io/tx/0xabc");
    process.env.NEXT_PUBLIC_EXPLORER_BASE = prev;
  });

  test("uses override base when provided (address)", () => {
    const prev = process.env.NEXT_PUBLIC_EXPLORER_BASE;
    process.env.NEXT_PUBLIC_EXPLORER_BASE = "https://custom.explorer/"; // with trailing slash
    expect(getExplorerAddressUrl("baseSepolia", "0xaddr")).toBe("https://custom.explorer/address/0xaddr");
    process.env.NEXT_PUBLIC_EXPLORER_BASE = prev;
  });
});



