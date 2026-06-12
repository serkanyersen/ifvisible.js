import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IfVisible } from "../ifvisible";
import { STATUS_ACTIVE, STATUS_HIDDEN, STATUS_IDLE } from "../consts";

function setHidden(value: boolean) {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => value,
  });
}

describe("IfVisible", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setHidden(false);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("starts active", () => {
    const iv = new IfVisible();
    expect(iv.status).toBe(STATUS_ACTIVE);
    expect(iv.now()).toBe(true);
    expect(iv.isSupported).toBe(true);
    iv.destroy();
  });

  it("now() checks against a given status", () => {
    const iv = new IfVisible();
    expect(iv.now(STATUS_ACTIVE)).toBe(true);
    expect(iv.now(STATUS_HIDDEN)).toBe(false);
    iv.destroy();
  });

  it("goes idle after the idle duration and emits events", () => {
    const iv = new IfVisible();
    const onIdle = vi.fn();
    const onStatus = vi.fn();
    iv.on("idle", onIdle);
    iv.on("statusChanged", onStatus);

    vi.advanceTimersByTime(30000);

    expect(iv.status).toBe(STATUS_IDLE);
    expect(onIdle).toHaveBeenCalledOnce();
    expect(onStatus).toHaveBeenCalledWith({ status: STATUS_IDLE });
    iv.destroy();
  });

  it("respects a custom idle duration", () => {
    const iv = new IfVisible();
    iv.setIdleDuration(5);
    expect(iv.getIdleDuration()).toBe(5000);

    vi.advanceTimersByTime(4999);
    expect(iv.status).toBe(STATUS_ACTIVE);
    vi.advanceTimersByTime(1);
    expect(iv.status).toBe(STATUS_IDLE);
    iv.destroy();
  });

  it("wakes up from idle on user activity", () => {
    const iv = new IfVisible();
    const onWakeup = vi.fn();
    iv.on("wakeup", onWakeup);

    vi.advanceTimersByTime(30000);
    expect(iv.status).toBe(STATUS_IDLE);

    document.dispatchEvent(new Event("mousedown"));
    expect(iv.status).toBe(STATUS_ACTIVE);
    expect(onWakeup).toHaveBeenCalledOnce();
    iv.destroy();
  });

  it("blurs and focuses on visibilitychange", () => {
    const iv = new IfVisible();
    const onBlur = vi.fn();
    const onFocus = vi.fn();
    iv.on("blur", onBlur);
    iv.on("focus", onFocus);

    setHidden(true);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(iv.status).toBe(STATUS_HIDDEN);
    expect(onBlur).toHaveBeenCalledOnce();

    setHidden(false);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(iv.status).toBe(STATUS_ACTIVE);
    expect(onFocus).toHaveBeenCalledOnce();
    iv.destroy();
  });

  it("reports idle info", () => {
    const iv = new IfVisible();
    const info = iv.getIdleInfo();
    expect(info.isIdle).toBe(false);
    expect(info.timeLeft).toBeLessThanOrEqual(30000);
    expect(info.timeLeftPer).toBeGreaterThanOrEqual(0);

    vi.advanceTimersByTime(30000);
    expect(iv.getIdleInfo().isIdle).toBe(true);
    expect(iv.getIdleInfo().timeLeftPer).toBe(100);
    iv.destroy();
  });

  it("isolates events between instances (no shared global store)", () => {
    const a = new IfVisible();
    const b = new IfVisible();
    const onA = vi.fn();
    a.on("idle", onA);

    // Fire idle on b only; a's handler must not be called.
    b.idle();
    expect(onA).not.toHaveBeenCalled();
    expect(b.status).toBe(STATUS_IDLE);
    expect(a.status).toBe(STATUS_ACTIVE);
    a.destroy();
    b.destroy();
  });

  it("destroy() removes listeners so further DOM events are ignored", () => {
    const iv = new IfVisible();
    const onBlur = vi.fn();
    iv.on("blur", onBlur);
    iv.destroy();

    setHidden(true);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(onBlur).not.toHaveBeenCalled();
  });

  it("surfaces Page Lifecycle freeze/resume events", () => {
    const iv = new IfVisible();
    const onFreeze = vi.fn();
    const onResume = vi.fn();
    iv.on("freeze", onFreeze);
    iv.on("resume", onResume);

    document.dispatchEvent(new Event("freeze"));
    document.dispatchEvent(new Event("resume"));
    expect(onFreeze).toHaveBeenCalledOnce();
    expect(onResume).toHaveBeenCalledOnce();
    iv.destroy();
  });
});
