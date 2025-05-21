import { Events as EventsAPI } from '../Events';

describe('Events', () => {
  beforeEach(() => {
    EventsAPI.remove('test');
  });

  it('should register and fire event', () => {
    expect.assertions(1);
    EventsAPI.attach('test', () => {
      expect(true).toBe(true);
    });
    EventsAPI.fire('test');
  });

  it('should register and fire multiple events with same name', () => {
    expect.assertions(2);
    EventsAPI.attach('test', () => {
      expect(1).toBe(1);
    });
    EventsAPI.attach('test', () => {
      expect(2).toBe(2);
    });
    EventsAPI.fire('test');
  });

  it('should pass arguments to event handler', () => {
    expect.assertions(1);
    EventsAPI.attach('test', (...args) => {
      expect(args).toEqual([1, 2, 3, 4]);
    });
    EventsAPI.fire('test', [1, 2, 3, 4]);
  });

  it('should remove events', () => {
    expect.assertions(1);
    EventsAPI.attach('test', (...args) => {
      expect(args).toEqual([1, 2, 3, 4]);
    });
    EventsAPI.fire('test', [1, 2, 3, 4]);
    EventsAPI.remove('test');
    EventsAPI.fire('test', [1, 2, 3, 4]);
    // should not fire the event again, only one assertion
  });

  it('should remove events just the given event', () => {
    expect.assertions(3);
    const handler = (...args) => {
      expect(args).toEqual([1, 2, 3, 4]);
    };
    EventsAPI.attach('test', handler);
    EventsAPI.attach('test', (...args) => {
      expect(args).toEqual([1, 2, 3, 4]);
    });
    EventsAPI.fire('test', [1, 2, 3, 4]);
    EventsAPI.remove('test', handler); // removes the first one but leaves the second
    EventsAPI.fire('test', [1, 2, 3, 4]);
    // in total 3 assertions were fired instead of 4
  });
});
