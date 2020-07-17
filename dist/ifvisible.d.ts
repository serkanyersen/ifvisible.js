import Timer from './Timer';
export declare const STATUS_ACTIVE = "active";
export declare const STATUS_IDLE = "idle";
export declare const STATUS_HIDDEN = "hidden";
export interface IIdleInfo {
    isIdle: boolean;
    idleFor: number;
    timeLeft: number;
    timeLeftPer: number;
}
export declare const IE: any;
export declare class IfVisible {
    private root;
    private doc;
    status: string;
    VERSION: string;
    private timers;
    private idleTime;
    private idleStartedTime;
    private isLegacyModeOn;
    constructor(root: any, doc: any);
    legacyMode(): void;
    startIdleTimer(event?: Event): void;
    trackIdleStatus(): void;
    on(event: string, callback: (data: any) => any): IfVisible;
    off(event: string, callback?: any): IfVisible;
    setIdleDuration(seconds: number): IfVisible;
    getIdleDuration(): number;
    getIdleInfo(): IIdleInfo;
    idle(callback?: (data: any) => any): IfVisible;
    blur(callback?: (data: any) => any): IfVisible;
    focus(callback?: (data: any) => any): IfVisible;
    wakeup(callback?: (data: any) => any): IfVisible;
    onEvery(seconds: number, callback: Function): Timer;
    now(check?: string): boolean;
}
