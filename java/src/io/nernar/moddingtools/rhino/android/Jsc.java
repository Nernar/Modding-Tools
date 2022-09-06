package io.nernar.moddingtools.rhino.android;

import com.faendir.rhino_android.AndroidClassLoader;
import com.faendir.rhino_android.RhinoAndroidHelper;
import io.nernar.moddingtools.rhino.EvaluatorFactory;
import java.io.File;
import java.io.IOException;
import java.io.Reader;
import org.mozilla.javascript.CompilerEnvirons;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;

public class Jsc {
	private final CompilerEnvirons compilerEnv;
	private final ErrorReporter compilationErrorReporter;
	static RhinoAndroidHelper rhinoHelper;
	
	public Jsc(CompilerEnvirons compilerEnv, ErrorReporter compilationErrorReporter) {
		this.compilerEnv = compilerEnv;
		this.compilationErrorReporter = compilationErrorReporter;
	}
	
	public Jsc() {
		this(null, null);
	}
	
	static Context enterContext(CompilerEnvirons compilerEnv) {
		if (rhinoHelper == null) {
			rhinoHelper = new RhinoAndroidHelper();
		}
		Context cx = rhinoHelper.enterContext();
		if (compilerEnv == null) {
			cx.setLanguageVersion(Context.VERSION_ES6);
		} else {
			cx.setLanguageVersion(compilerEnv.getLanguageVersion());
		}
		cx.setOptimizationLevel(9);
		return cx;
	}
	
	private static void enterCompilationMode(String path) throws IOException {
		File file = new File(path);
		if (file.isDirectory() || !file.getParentFile().mkdirs()) {
			throw new IOException("File unaccessible or is directory");
		}
		AndroidClassLoader.enterCompilationMode(path);
	}
	
	public Script compileReader(Reader in, String sourcePath, String sourceName) throws IOException {
		enterCompilationMode(sourcePath);
		Script what = EvaluatorFactory.compileReader(enterContext(this.compilerEnv), in, EvaluatorFactory.getClassName(sourceName), 0, null, null, this.compilationErrorReporter, this.compilerEnv);
		AndroidClassLoader.exitCompilationMode();
		return what;
	}
	
	public Script compileString(String source, String sourcePath, String sourceName) throws IOException {
		enterCompilationMode(sourcePath);
		Script what = EvaluatorFactory.compileString(enterContext(this.compilerEnv), source, EvaluatorFactory.getClassName(sourceName), 0, null, null, this.compilationErrorReporter, this.compilerEnv);
		AndroidClassLoader.exitCompilationMode();
		return what;
	}
	
	public Function compileFunction(Scriptable scope, String source, String sourcePath, String sourceName) throws IOException {
		enterCompilationMode(sourcePath);
		Function what = EvaluatorFactory.compileFunction(enterContext(this.compilerEnv), scope, source, EvaluatorFactory.getClassName(sourceName), 0, null, null, this.compilationErrorReporter, this.compilerEnv);
		AndroidClassLoader.exitCompilationMode();
		return what;
	}
}
