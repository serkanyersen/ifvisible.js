// @vitest-environment node
import { describe, expect, it } from "vitest";
import { IfVisible } from "../ifvisible";
import { ifvisible } from "../main";
import { STATUS_ACTIVE } from "../consts";

// Runs in a real Node environment where `document`/`window` do not exist,
// exercising the actual SSR code path (not a jsdom simulation).
describe("IfVisible (SSR / non-DOM)", () => {
  it("constructs without a document and stays a safe no-op", () => {
    const iv = new IfVisible();
    expect(iv.isSupported).toBe(false);
    expect(iv.status).toBe(STATUS_ACTIVE);
    expect(iv.now()).toBe(true);
    expect(() => iv.setIdleDuration(10)).not.toThrow();
    expect(() => iv.onEvery(1, () => {})).not.toThrow();
    expect(() => iv.destroy()).not.toThrow();
  });

  it("importing the default singleton on the server does not throw", () => {
    expect(ifvisible).toBeDefined();
    expect(ifvisible.isSupported).toBe(false);
    expect(ifvisible.now()).toBe(true);
  });
});
