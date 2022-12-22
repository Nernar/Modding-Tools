/**
 * Milliseconds from moment when library started.
 */
declare const launchTime: number;
/**
 * Determines engine: Inner Core v1 or Horizon v2.
 */
declare const isHorizon: boolean;
/**
 * Minecraft version running by Inner Core.
 * It must be `0`, `11` or `16`.
 */
declare const minecraftVersion: number;
/**
 * Currently running activity, it context must be
 * required to perform interactions with Android.
 */
declare const getContext: () => android.app.Activity;
/**
 * Display error in window, possibly in particular,
 * useful for visualizing and debugging problems.
 */
declare const reportError: (error: any) => void;
/**
 * Registers exception report action, it will be used as
 * default when {@link handle}, {@link handleThread}, etc. fails.
 * @param when action to perform with error
 */
declare const registerReportAction: (when: (error: any) => void) => void;
/**
 * Displays a log window for user whether it is
 * needed or not. On latest versions, number of such
 * windows on screen is limited for performance reasons.
 * @param message additional information
 * @param title e.g. mod name
 * @param fallback when too much dialogs
 */
declare const showReportDialog: (message: string, title: string, fallback?: Function) => void;
/**
 * Delays the action in main thread pool
 * directly for the required time, unhandled
 * exceptions will cause crash.
 * @param action action
 * @param time expectation
 * @returns sheduled future when no associated context
 */
declare const handleOnThread: (action: () => void, time?: number) => void | java.util.concurrent.ScheduledFuture<any>;
/**
 * Delays the action in main thread pool
 * safely for the required time.
 * @param action action
 * @param time expectation
 * @see {@link handleOnThread}
 */
declare const handle: (action: () => void, time?: number) => void | java.util.concurrent.ScheduledFuture<any>;
/**
 * Delays the action in main thread pool and
 * async waiting it in current thread.
 * @param action to be acquired
 * @param fallback default value
 * @returns action result or {@link fallback}
 * @see {@link handleOnThread}
 */
declare const acquire: (action: () => any, fallback?: any) => any;
/**
 * Interrupts currently stacked threads, it must
 * be implemented in your {@link java.lang.Thread Thread} itself.
 */
declare const interruptThreads: () => void;
/**
 * Processes some action, that can be
 * completed in foreground or background.
 * @param action action
 * @param priority number between 1-10
 */
declare const handleThread: (action: () => void, priority?: number) => java.lang.Thread;
/**
 * Generates a random number from minimum to
 * maximum value. If only the first is indicated,
 * generation will occur with a probability of
 * one less than a given number.
 * @param min minimum number
 * @param max maximum number
 */
declare const random: (min: number, max?: number) => number;
/**
 * Returns the difference between the current time
 * and the start time of the library.
 */
declare const getTime: () => number;
/**
 * Returns `true` when numeral is verb in europic
 * languages, e.g. when count % 10 = 1, etc.
 * @param count integer
 */
declare const isNumeralVerb: (count: number) => boolean;
/**
 * Returns `true` when numeral is many in europic
 * languages, e.g. when count >= *5, count % 10 = 0, etc.
 * @param count integer
 */
declare const isNumeralMany: (count: number) => boolean;
/**
 * Translates existing strokes, added via
 * {@link Translation.addTranslation}, replaces
 * formatted `%s`, `%d` and similiar arguments.
 * @param str stroke to translate
 * @param args to replace with `format`
 */
declare const translate: (str: string, args?: any[]) => string;
/**
 * Translates existing strokes by numeral, added via
 * {@link Translation.addTranslation}, replaces
 * formatted `%s`, `%d` and similiar arguments.
 * Uses simply europic languages verbs in counters.
 * @param count numeric integer to perform translation
 * @param whenZero count = 0
 * @param whenVerb count % 10 = 1, see {@link isNumeralVerb}
 * @param whenLittle any case instead of others when's
 * @param whenMany count >= *5, count % 10 = 0, see {@link isNumeralMany}
 * @param args to replace with `format`, when count = value it will be remapped additionally
 */
declare const translateCounter: (count: number, whenZero: string, whenVerb: string, whenLittle: string, whenMany: string, args?: any[]) => string;
/**
 * Shortcut to currently context decor window.
 */
declare const getDecorView: () => android.view.View;
/**
 * Maximum display metric, in pixels.
 */
declare const getDisplayWidth: () => number;
/**
 * Relative to display width value.
 * @param x percent of width
 */
declare const getDisplayPercentWidth: (x: number) => number;
/**
 * Minimum display metric, in pixels.
 */
declare const getDisplayHeight: () => number;
/**
 * Relative to display height value.
 * @param y percent of height
 */
declare const getDisplayPercentHeight: (y: number) => number;
/**
 * Dependent constant per pixel size on display.
 */
declare const getDisplayDensity: () => number;
/**
 * Relative dependent on pixel size width value.
 * @param x percent of width
 */
declare const getRelativeDisplayPercentWidth: (x: number) => number;
/**
 * Relative dependent on pixel size height value.
 * @param y percent of height
 */
declare const getRelativeDisplayPercentHeight: (y: number) => number;
/**
 * Applies Android TypedValue `COMPLEX_UNIT_DIP`.
 * @param value to change dimension
 */
declare const toComplexUnitDip: (value: number) => number;
/**
 * Applies Android TypedValue `COMPLEX_UNIT_SP`.
 * @param value to change dimension
 */
declare const toComplexUnitSp: (value: number) => number;
/**
 * For caching, you must use the check amount
 * files and any other content, the so-called hashes.
 * @param bytes to perform digest, e.g. `new java.lang.String(?).getBytes()`
 */
declare const toDigestMd5: (bytes: native.Array<number>) => string;
/**
 * Uses device vibrator service to make vibration.
 * @param milliseconds to vibrate
 */
declare const vibrate: (milliseconds: number) => void;
