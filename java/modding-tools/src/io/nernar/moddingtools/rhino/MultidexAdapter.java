package io.nernar.moddingtools.rhino;

import org.mozilla.javascript.Script;

public class MultidexAdapter {
	private MultidexAdapter() {}

	public static Class<? extends Script> coerce(Script to) {
		return to != null ? to.getClass() : null;
	}
}
