import { describe, expect, it, vi } from "vitest";
import { EventEmitter } from "../EventEmitter";

describe("EventEmitter", () => {
  it("registers and fires a handler", () => {
    const em = new EventEmitter();
    const fn = vi.fn();
    em.on("test", fn);
    em.fire("test");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("fires multiple handlers for the same event", () => {
    const em = new EventEmitter();
    const a = vi.fn();
    const b = vi.fn();
    em.on("test", a);
    em.on("test", b);
    em.fire("test");
    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
  });

  it("passes event data to handlers", () => {
    const em = new EventEmitter();
    const fn = vi.fn();
    em.on("test", fn);
    em.fire("test", { status: "idle" });
    expect(fn).toHaveBeenCalledWith({ status: "idle" });
  });

  it("removes all handlers for an event when no callback is given", () => {
    const em = new EventEmitter();
    const fn = vi.fn();
    em.on("test", fn);
    em.off("test");
    em.fire("test");
    expect(fn).not.toHaveBeenCalled();
  });

  it("removes only the given handler", () => {
    const em = new EventEmitter();
    const keep = vi.fn();
    const drop = vi.fn();
    em.on("test", keep);
    em.on("test", drop);
    em.off("test", drop);
    em.fire("test");
    expect(keep).toHaveBeenCalledOnce();
    expect(drop).not.toHaveBeenCalled();
  });

  it("deduplicates identical handlers (Set semantics)", () => {
    const em = new EventEmitter();
    const fn = vi.fn();
    em.on("test", fn);
    em.on("test", fn);
    em.fire("test");
    expect(fn).toHaveBeenCalledOnce();
  });

  it("does not break iteration when a handler detaches itself mid-fire", () => {
    const em = new EventEmitter();
    const second = vi.fn();
    const first = vi.fn(() => em.off("test"));
    em.on("test", first);
    em.on("test", second);
    expect(() => em.fire("test")).not.toThrow();
    expect(second).toHaveBeenCalledOnce();
  });
});
