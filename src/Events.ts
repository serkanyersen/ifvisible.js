export namespace Events {
  const store = {};
  let setListener: Function;

  export function attach (event: string, callback: Function) {
    if (!store[event]) {
      store[event] = [];
    }
    store[event].push(callback);
  }

  export function fire (event: string, args = []) {
    if (store[event]) {
      store[event].forEach(callback => {
        callback(...args);
      });
    }
  }

  export function remove (event: string, callback?: Function) {
    if (!callback) {
      delete store[event];
    }
    if (store[event]) {
      store[event] = store[event].filter(savedCallback => {
        return callback !== savedCallback;
      });
    }
  }

  export function dom (element: any, event: string, callback: Function) {
    if (!setListener) {
      if (element.addEventListener) {
        setListener = (el, ev, fn) => {
          return el.addEventListener(ev, fn, false);
        };
      } else if (typeof element.attachEvent === 'function') {
        setListener = (el, ev, fn) => {
          return el.attachEvent(`on${ev}`, fn, false);
        };
      } else {
        setListener = (el, ev, fn) => {
          // eslint-disable-next-line no-return-assign, no-param-reassign
          return el[`on${ev}`] = fn;
        };
      }
    }
    return setListener(element, event, callback);
  }
}

// export default Events;
