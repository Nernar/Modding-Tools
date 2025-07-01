/**
 * @constructor
 * Processes thread besides [[sync()]] interface
 * context, that was used to indicate process.
 * Calls [[process()]] for every element requested
 * by [[next()]] besides [[execute()]] passed value.
 * @param {any} [obj] merges with prototype
 */
declare function Sequence(obj?: any): void;
declare class Sequence {
    /**
     * @constructor
     * Processes thread besides [[sync()]] interface
     * context, that was used to indicate process.
     * Calls [[process()]] for every element requested
     * by [[next()]] besides [[execute()]] passed value.
     * @param {any} [obj] merges with prototype
     */
    constructor(obj?: any);
    update: any;
    tick: any;
    complete: any;
    uncount: any;
    create: any;
    completed: any;
    id: string;
    getThread(): {};
    getSynchronizeTime(): number;
    setSynchronizeTime(ms: any): void;
    between: number;
    getPriority(): number;
    setPriority(priority: any): void;
    priority: number;
    setFixedCount(count: any): void;
    count: number;
    getFixedCount(): number;
    setReportingEnabled(enabled: any): void;
    reporting: boolean;
    isReportingEnabled(): boolean;
    /**
     * Sync recursive action, that awaits when
     * process is completed, interrupted or cancelled.
     * @param {number} active process startup milliseconds
     */
    sync(active: number): void;
    /**
     * Action that launches main process and sync.
     * @param {any} [value] data to process
     */
    execute(value?: any): void;
    index: number;
    thread: {};
    /**
     * Must be called inside [[process()]] or [[next()]]
     * if you want to force update process indexes.
     * Recommended to use if [[uncount()]] wouldn't
     * help in dynamical reupdate or just update progress.
     * @param {number} [index] currently progress
     * @param {number} [count] maximum value
     */
    require(index?: number, count?: number): void;
    updated: boolean;
    shrink(addition: any): void;
    /**
     * @async Wouldn't access interface thread.
     * Calls for every item inside [[process]], passed
     * value will be used into it. That action created
     * to communicate executing object with process,
     * split it to processable parts.
     * @param {any} value passed on execute
     * @param {number} index was returned by [[process()]]
     * @returns {any} value or element to [[process()]]
     */
    next(value: any, index: number): any;
    /**
     * @async Wouldn't access interface thread.
     * Main sequence process in thread;
     * handles object and returns index.
     * @param {any} element next result to handle
     * @param {any} value elements resolver
     * @param {number} index indicates progress
     * @returns {number} index to sync
     * @throws must be overwritten in usage
     */
    process(element: any, value: any, index: number): number;
    cancel(error: any): void;
    interrupt(): void;
    isInterrupted(): any;
    assureYield(thread: any): boolean;
}
declare namespace Sequence {
    let uid: number;
}
