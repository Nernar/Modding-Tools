/**
 * Allows you to create timers that will constantly
 * check the conditions for subsequent execution.
 * @param {object|number} [obj] merges with prototype or tick time
 */
declare function Action(obj?: object | number): void;
declare class Action {
    /**
     * Allows you to create timers that will constantly
     * check the conditions for subsequent execution.
     * @param {object|number} [obj] merges with prototype or tick time
     */
    constructor(obj?: object | number);
    id: string;
    getThread(): any;
    getPriority(): number;
    setPriority(priority: any): void;
    priority: number;
    mayCancelled(): boolean;
    setIsMayCancelled(cancelable: any): void;
    cancelable: boolean;
    setAwait(time: any): void;
    left: number;
    makeInfinity(): void;
    getAwait(): number;
    setRealAwait(ms: any): void;
    getRealAwait(): number;
    setTickTime(time: any): void;
    sleep: number;
    getTickTime(): number;
    setCurrentTick(count: any): void;
    count: number;
    getCurrentTick(): number;
    getRealTick(): number;
    getLeftTime(): number;
    isActive(): boolean;
    setAction(action: any): boolean;
    action: any;
    setCondition(action: any): boolean;
    onCondition: any;
    create(): this;
    real: number;
    thread: any;
    condition(currently: any): any;
    tick(currently: any): any;
    run(): void;
    active: boolean;
    complete(): void;
    pause(time: any): void;
    cancel(): void;
    destroy(): void;
    setOnCreateListener(action: any): boolean;
    onCreate: any;
    setOnRunListener(action: any): boolean;
    onRun: any;
    setOnTickListener(action: any): boolean;
    onTick: any;
    setOnPauseListener(action: any): boolean;
    onPause: any;
    setOnCancelListener(action: any): boolean;
    onCancel: any;
    setOnDestroyListener(action: any): boolean;
    onDestroy: any;
    interrupt(): void;
    isInterrupted(): any;
    assureYield(thread: any): boolean;
}
declare namespace Action {
    let uid: number;
}
/**
 * Delays the action in the interface thread for
 * the required time with the specified condition.
 * @param {function|object} action action or prototype
 * @param {function} [condition] condition
 * @param {number} [time] tick waiting
 * @returns {Action} special event
 */
declare function handleAction(action: Function | object, condition?: Function, time?: number): Action;
