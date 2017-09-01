import Events from "../Events";

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
            expect(args).toEqual([1, 2, 3, 4]);
        });
        Events.fire("test", [1, 2, 3, 4]);
    });
});
