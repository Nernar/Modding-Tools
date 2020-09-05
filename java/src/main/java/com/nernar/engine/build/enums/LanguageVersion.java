package com.nernar.engine.build.enums;

import org.mozilla.javascript.Context;

public enum LanguageVersion {
	DEFAULT("default", Context.VERSION_DEFAULT),
    M1996("1.0", Context.VERSION_1_0),
	A1996("1.1", Context.VERSION_1_1),
	J1997("1.2", Context.VERSION_1_2),
	O1998("1.3", Context.VERSION_1_3),
	M1999("1.4", Context.VERSION_1_4),
	N2000("1.5", Context.VERSION_1_5),
	N2005("1.6", Context.VERSION_1_6),
	F2006("1.7", Context.VERSION_1_7),
	F2008("1.8", Context.VERSION_1_8),
	ES6("es6", Context.VERSION_ES6),
	UNKNOWN("unknown", Context.VERSION_UNKNOWN);
	
	protected String version;
	protected int code;
	
	private LanguageVersion(String version, int code) {
		this.version = version;
		this.code = code;
	}
	
	public static LanguageVersion find(int code) {
		for (LanguageVersion value : values()) {
			if (value.toCode() == code) {
				return value;
			}
		}
		return null;
	}
	
	public static LanguageVersion find(String version) {
		for (LanguageVersion value : values()) {
			if (value.toVersion() == version) {
				return value;
			}
		}
		return null;
	}
	
	public String toVersion() {
		return version;
	}
	
	public int toCode() {
		return code;
	}
	
	@Override
	public String toString() {
		return version + " (api " + code + ")";
	}
}
