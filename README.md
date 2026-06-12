## ifvisible.js

Crossbrowser & lightweight way to check if user is looking at the page or interacting with it.

#### Check out the [Demo](http://serkanyersen.github.com/ifvisible.js/demo.html) or read below for code example or Check [Annotated Source](http://serkanyersen.github.com/ifvisible.js/docs/ifvisible.html)

## Installation

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fserkanyersen%2Fifvisible.js.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fserkanyersen%2Fifvisible.js?ref=badge_shield)

```
npm install ifvisible.js
```

## Usage

ifvisible.js ships as ESM, CommonJS, and a browser global, with bundled
TypeScript types.

```javascript
// ES modules (recommended)
import ifvisible from "ifvisible.js";

// Named exports are also available:
import { ifvisible, IfVisible, type IfVisibleEvent } from "ifvisible.js";
```

```javascript
// CommonJS
const { ifvisible } = require("ifvisible.js");
```

```html
<!-- Browser global -->
<script src="https://unpkg.com/ifvisible.js"></script>
<script>
  ifvisible.now(); // global `ifvisible` singleton
</script>
```

> **SSR-safe:** importing `ifvisible.js` in Node / during server-side rendering
> never throws. In a non-DOM environment `ifvisible.isSupported` is `false` and
> every method is a safe no-op (`now()` returns `true`).

## v3 highlights

ifvisible.js 3 is a clean-break rewrite. It is a major version bump.

- Modern ESM + CJS + IIFE builds with bundled `.d.ts` types.
- All legacy IE / vendor-prefix code removed; uses the standard Page Visibility API.
- SSR-safe singleton — no DOM access at import time.
- Per-instance event isolation (multiple `new IfVisible()` instances no longer share one global event store).
- New `freeze` / `resume` events from the [Page Lifecycle API](https://developer.chrome.com/docs/web-platform/page-lifecycle-api) (bfcache).
- New `ifvisible.destroy()` to detach all listeners and timers on teardown (SPA/route unmount).

## Examples

```javascript
// If page is visible right now
if (ifvisible.now()) {
  // Display pop-up
  openPopUp();
}

// You can also check the page status
// using `now` method
if (!ifvisible.now("hidden")) {
  // Display pop-up if page is not hidden
  openPopUp();
}

// Possible statuses are:
// idle: when user has no interaction
// hidden: page is not visible
// active: page is visible and user is active
```

Handle tab switch or browser minimize states

```javascript
ifvisible.on("blur", function () {
  // example code here..
  animations.pause();
});

ifvisible.on("focus", function () {
  // resume all animations
  animations.resume();
});
```

ifvisible.js can handle activity states too, such as being IDLE or ACTIVE on the page

```javascript
ifvisible.on("idle", function () {
  // Stop auto updating the live data
  stream.pause();
});

ifvisible.on("wakeup", function () {
  // go back updating data
  stream.resume();
});
```

Default idle duration is 30 seconds but you can change it with `setIdleDuration` method

```javascript
ifvisible.setIdleDuration(120); // Page will become idle after 120 seconds
```

You can manually trigger status events by calling them directly or you can set events with their names by giving first argument as a callback

```javascript
ifvisible.idle(); // will put page in a idle status

ifvisible.idle(function () {
  // This code will work when page goes into idle status
});

// other methods are
ifvisible.blur(); // will trigger idle event as well
ifvisible.idle();

ifvisible.focus(); // Will trigger wakeup event as well
ifvisible.wakeup();
```

You can use ifvisible.off() to remove event triggers:

```javascript
ifvisible.off("idle", triggeredFunction); // will remove only triggeredFunction from being tiggered on idle
ifvisible.off("idle"); // will remove all events triggered on idle

// works with other events:
ifvisible.off("blur");
ifvisible.off("wakeup");
ifvisible.off("focus");
```

You can set your smart intervals with ifvisible.js, if user is IDLE or not seeing the page the interval will automatically stop itself

```javascript
// If page is visible run this function on every half seconds
ifvisible.onEvery(0.5, function () {
  // Do an animation on the logo only when page is visible
  animateLogo();
});
```

### Page Lifecycle (freeze / resume)

The browser may freeze a backgrounded page (bfcache) and later resume it.
ifvisible.js surfaces these as events:

```javascript
ifvisible.on("freeze", function () {
  // Page is about to be frozen — flush state, close connections.
});

ifvisible.on("resume", function () {
  // Page was resumed from the back/forward cache.
});
```

### Cleanup

Call `destroy()` to remove every DOM listener, handler, and timer — useful when
unmounting in a single-page app:

```javascript
const instance = new IfVisible();
// ...later
instance.destroy();
```

### License

It's MIT, Go crazy.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fserkanyersen%2Fifvisible.js.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fserkanyersen%2Fifvisible.js?ref=badge_large)
