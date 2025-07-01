declare function isValidFile(file: any): boolean;
declare let launchTime: number;
declare let isHorizon: boolean;
declare let InnerCorePackages: any;
declare let showToast: typeof print;
declare function getLoadedModList(): any;
declare function fetchScriptSources(mod: any): {};
declare function setupLoadedSources(mods: any): void;
declare namespace setupLoadedSources {
    let mods: {};
    let sources: {};
}
declare function getModName(id: any): string;
declare function findAvailabledMods(name: any): string[];
declare function findRelatedSources(name: any, file: any): {};
declare function reformatSpecial(element: any): any;
declare function requireFormat(message: any): {
    message: string;
    exec: RegExpExecArray;
} | {
    message: any;
    exec?: undefined;
};
declare function translateMessage(message: any): any;
declare function resolveTraceSource(line: any): {
    trace: any;
    where: any;
    line: any;
    source: any;
    file: any;
};
declare function sliceMessageWithoutTrace(message: any, line: any): any;
declare function retraceToArray(trace: any): any;
declare function fetchErrorMessage(error: any): string;
declare function fetchErrorName(error: any): string;
declare function saveOrRewrite(path: any, text: any): void;
declare function addTranslation(prefix: any, who: any, translation: any): void;
declare namespace addTranslation {
    let messages: {};
}
/**
 * Fetches error message and represent it
 * into localized string without source.
 * @param {Error|string} error to localize
 * @returns {string} represented stroke
 */
declare function localizeError(error: Error | string): string;
/**
 * Reports catched modification errors,
 * may used in [[catch]]-block when any throw
 * code occurs. Stacktrace will be displayed
 * on display with sources hieracly.
 * @param {Error|any} error value to report
 */
declare function reportTrace(error: Error | any): void;
declare namespace reportTrace {
    let isReporting: boolean;
    let handled: any[];
    function postUpdate(dialog: any, error: any, date: any): {
        inProcess: () => boolean;
        toResult: () => any;
        cancel: () => void;
    };
    function processFile(file: any, where: any): any[];
    function processSources(related: any, resolved: any, where: any): any[];
    function processStack(resolved: any): string;
    function handleRequest(handler: any, update: any, trace: any): {
        formatted: any[];
    };
    function findNextTrace(): any;
    function fetchTime(): number;
    function toCode(error: any): string;
    function setupPrint(action: any): boolean;
    function reloadModifications(): void;
}
