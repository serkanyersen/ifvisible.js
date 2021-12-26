import { EventData } from "./consts";
interface IEElement extends Element {
  attachEvent(event: string, listener: EventListener): boolean;
  detachEvent(event: string, listener: EventListener): void;
}

const store = {};
let setListener: (el: Element, ev: string, fn: () => void) => void;

export function attach(event: string, callback: (data: EventData) => void) {
  if (!store[event]) {
    store[event] = [];
  }
  store[event].push(callback);
}

export function fire(event: string, data?: EventData) {
  if (store[event]) {
    store[event].forEach((callback: (data: EventData) => void) => {
      callback(data);
    });
  }
}

export function remove(event: string, callback?: (data: EventData) => void) {
  if (!callback) {
    delete store[event];
  }
  if (store[event]) {
    store[event] = store[event].filter(
      (savedCallback: (data: EventData) => void) => callback !== savedCallback
    );
  }
}

export function dom(element: Element, event: string, callback: () => void) {
  if (!setListener) {
    if (element.addEventListener) {
      setListener = (el: Element, ev: string, fn: () => void) =>
        el.addEventListener(ev, fn, false);
    } else if (typeof (element as IEElement).attachEvent === "function") {
      setListener = (el: Element, ev: string, fn: () => void) =>
        (el as IEElement).attachEvent(`on${ev}`, fn);
    } else {
      // eslint-disable-next-line no-return-assign
      setListener = (el: Element, ev: string, fn: () => void) =>
        // eslint-disable-next-line no-return-assign, no-param-reassign
        (el[`on${ev}`] = fn);
    }
  }
  return setListener(element, event, callback);
}
