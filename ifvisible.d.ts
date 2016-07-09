interface onEveryReturn {
    /**
        * Callback function you passed to onEvery
        */
    callback: () => void;
    /**
        * Timer Id of setInterval
        */
    code: number;

    /**
        * Stop the interval, you cannot resume
        */
    stop(): boolean;

    /**
        * Pauses the interval, it's resumable
        */
    pause(): boolean;

    /**
        * Resumes paused interval
        */
    resume(): boolean;
}

interface IdleInfo {
    /**
        * if page idle now?
        */
    isIdle: boolean,

    /**
        * How long was the page idle in milliseconds
        */
    idleFor: number,

    /**
        * How much time left to become idle in milliseconds
        */
    timeLeft: number,

    /**
        * How much time left to become idle represented as percentage
        */
    timeLeftPer: string
}

interface IfVisible {
    /**
        * Registers a callback function to blur event
        * @param callback function to run when event fires
        */
    blur(callback: () => void): IfVisible;

    /**
        * Triggers the blur event
        */
    blur(): IfVisible;

    /**
        * Registers a callback function to focus event
        * @param callback function to run when event fires
        */
    focus(callback: () => void): IfVisible;

    /**
        * Triggers the focus event
        */
    focus(): IfVisible;

    /**
        * Registers a callback function to idle event
        * @param callback function to run when event fires
        */
    idle(callback: () => void): IfVisible;

    /**
        * Triggers the idle event
        */
    idle(): IfVisible;

    /**
        * Registers a callback function to wakeup event
        * @param callback function to run when event fires
        */
    wakeup(callback: () => void): IfVisible;

    /**
        * Triggers the wakeup event
        */
    wakeup(): IfVisible;

    /**
        * Register any event
        * @param name Name of the event
        * @param callback Function to run when event fires
        */
    on(name: string, callback: (status?: string) => void): number;

    /**
        * Unregister given event of name
        * @param name name of the event
        * @param handler function to remove from registered events
        */
    off(name: string, handler: Function): void;

    /**
        * Unregister all event of given name
        * @param name Name to unregister all events of
        */
    off(name: string): void;

    /**
        * Returns the current duration time in milliseconds
        */
    getIdleDuration(): number;

    /**
        * Returns detailed information about current idle status
        */
    getIdleInfo(): IdleInfo;

    /**
        * Given the event, it check if page is in that state for example
        * ifvisible.now('idle') return boolean to state if you are idle or not
        */
    now(check: string): boolean;

    /**
        * Tells if page is visible or not at the moment
        */
    now(): boolean;

    /**
        * Utility to run a given function at every given seconds intervals.
        * This method is smart and it will stop executing when the page is not active
        * @param seconds duration to wait between each interval in seconds
        * @param callback callback function run on every iteration
        */
    onEvery(seconds: number, callback: () => void): onEveryReturn;

    /**
        * Let's you change duration that page becomes idle dynamically
        * @param seconds new duration in seconds
        */
    setIdleDuration(seconds: number): number;
}

declare var ifvisible: IfVisible;

declare module 'ifvisible' {
    export = ifvisible;
}
