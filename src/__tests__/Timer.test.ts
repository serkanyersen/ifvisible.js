import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IfVisible } from "../ifvisible";

describe("Timer (onEvery)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("fires the callback on the given interval", () => {
    const iv = new IfVisible();
    const cb = vi.fn();
    iv.onEvery(1, cb);

    vi.advanceTimersByTime(3000);
    expect(cb).toHaveBeenCalledTimes(3);
    iv.destroy();
  });

  it("pauses while idle and resumes on wakeup", () => {
    const iv = new IfVisible();
    const cb = vi.fn();
    iv.onEvery(1, cb);

    // Go idle (default 30s). The status change should pause the interval.
    vi.advanceTimersByTime(30000);
    const callsAtIdle = cb.mock.calls.length;

    vi.advanceTimersByTime(5000);
    expect(cb.mock.calls.length).toBe(callsAtIdle);

    // User activity wakes up -> timer restarts.
    document.dispatchEvent(new Event("mousedown"));
    vi.advanceTimersByTime(2000);
    expect(cb.mock.calls.length).toBeGreaterThan(callsAtIdle);
    iv.destroy();
  });

  it("can be stopped explicitly", () => {
    const iv = new IfVisible();
    const cb = vi.fn();
    const timer = iv.onEvery(1, cb);
    timer.stop();

    vi.advanceTimersByTime(5000);
    expect(cb).not.toHaveBeenCalled();
    iv.destroy();
  });
});
