import * as Events from "../Events";

describe("Events", () => {
  beforeEach(() => {
    Events.remove("test");
  });

  it("should register and fire event", () => {
    expect.assertions(1);
    Events.attach("test", () => {
      expect(true).toBe(true);
    });
    Events.fire("test");
  });

  it("should register and fire multiple events with same name", () => {
    expect.assertions(2);
    Events.attach("test", () => {
      expect(1).toBe(1);
    });
    Events.attach("test", () => {
      expect(2).toBe(2);
    });
    Events.fire("test");
  });

  it("should pass arguments to event handler", () => {
    expect.assertions(1);
    Events.attach("test", (...args) => {
      expect(args).toEqual({ status: "test" });
    });
    Events.fire("test", { status: "test" });
  });

  it("should remove events", () => {
    expect.assertions(1);
    Events.attach("test", (...args) => {
      expect(args).toEqual({ status: "test" });
    });
    Events.fire("test", { status: "test" });
    Events.remove("test");
    Events.fire("test", { status: "test" });
    // should not fire the event again, only one assertion
  });

  it("should remove events just the given event", () => {
    expect.assertions(3);
    const handler = (...args) => {
      expect(args).toEqual({ status: "test" });
    };
    Events.attach("test", handler);
    Events.attach("test", (...args) => {
      expect(args).toEqual({ status: "test" });
    });
    Events.fire("test", { status: "test" });
    Events.remove("test", handler); // removes the first one but leaves the second
    Events.fire("test", { status: "test" });
    // in total 3 assertions were fired instead of 4
  });
});
