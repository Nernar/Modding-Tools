package io.nernar.moddingtools.rhino;

import java.util.ArrayList;
import java.util.List;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;

public class CorruptedScript implements Script {
	private Script script;
	private final List<Corruption> corruptions;
	private Throwable activeCause = null;
	private int activeStartLineNumber = -1;

	CorruptedScript() {
		this.corruptions = new ArrayList<>();
	}

	class Corruption {
		public final Throwable cause;
		public final int startLineNumber;
		public final int endLineNumber;

		Corruption(Throwable cause, int startLineNumber, int endLineNumber) {
			this.cause = cause;
			this.startLineNumber = startLineNumber;
			this.endLineNumber = endLineNumber;
		}
	}

	void captureCorruption(int lineNumber, Throwable who) {
		endCorruption(lineNumber);
		this.activeCause = who;
		this.activeStartLineNumber = lineNumber;
	}

	void endCorruption(int lineNumber) {
		if (this.activeCause == null) {
			return;
		}
		this.corruptions.add(new Corruption(this.activeCause, this.activeStartLineNumber, lineNumber));
		this.activeCause = null;
	}

	void captureScript(Script script) {
		endCorruption(activeStartLineNumber);
		this.script = script;
	}

	public Script getScript() {
		return this.script;
	}

	public List<Corruption> getCorruptions() {
		return this.corruptions;
	}

	public int getLastCapturedLineNumber() {
		return this.activeStartLineNumber;
	}

	@Override
	public Object exec(Context cx, Scriptable scope) {
		if (this.script == null) {
			throw new IllegalStateException("script == null");
		}
		return this.script.exec(cx, scope);
	}
}
