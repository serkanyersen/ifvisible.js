import { IfVisible } from './ifvisible';
export default class Timer {
    private ifvisible;
    private seconds;
    private callback;
    private token;
    stopped: boolean;
    constructor(ifvisible: IfVisible, seconds: number, callback: Function);
    private start;
    stop(): void;
    resume(): void;
    pause(): void;
}
