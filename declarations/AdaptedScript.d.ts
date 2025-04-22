declare const Packages: any;
declare const MCSystem: typeof LowLevelUtils;

declare namespace android {
	const support: any;
}

declare class JavaImporter {
	constructor(...args: any);
	importClass(clazz: any): void;
	importPackage(pkg: any): void;
	[key: string]: any;
}

declare namespace org {
	const mozilla: any;
}

declare function log(text: string): void;
