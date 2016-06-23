import { exporter, IfVisible } from "./ifvisible.ts";

exporter(window, () => {
    return new IfVisible();
});
