import { EventData } from "../consts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ifvisible = (globalThis as any).ifvisible;

function d(el: string) {
  return document.getElementById(el);
}
ifvisible.setIdleDuration(6);

ifvisible.on("statusChanged", function (e: EventData) {
  d("result").innerHTML += e.status + "<br>";
});

ifvisible.idle(function () {
  d("result2").innerHTML = "(-_-) Good bye. ZzzZZzz...";
  document.body.style.opacity = "0.5";
});
ifvisible.blur(function () {
  d("result2").innerHTML = "(-_o) Where did you go?";
  document.body.style.opacity = "0.5";
});
ifvisible.wakeup(function () {
  d("result2").innerHTML = "(O_o) Hey!, you woke me up.";
  document.body.style.opacity = "1";
});

ifvisible.onEvery(0.5, function () {
  // Clock, as simple as it gets
  let h: number | string = new Date().getHours();
  let m: number | string = new Date().getMinutes();
  let s: number | string = new Date().getSeconds();
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  // Update clock
  d("result3").innerHTML = h + ":" + m + ":" + s;
});

setInterval(function () {
  const info = ifvisible.getIdleInfo();
  // Give 3% margin to stabilize user output
  if (info.timeLeftPer < 3) {
    info.timeLeftPer = 0;
    info.timeLeft = ifvisible.getIdleDuration();
  }
  d("seconds").innerHTML = Number(info.timeLeft / 1000).toFixed(0);
  d("idlebar").style.width = info.timeLeftPer + "%";
}, 100);

const dur = ifvisible.getIdleDuration() / 1000;
d("seconds").innerHTML = String(dur);
d("idleTime").innerHTML = dur + " seconds";
