package io.nernar.moddingtools.rhino;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import org.mozilla.javascript.CompilerEnvirons;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.Evaluator;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.IRFactory;
import org.mozilla.javascript.Kit;
import org.mozilla.javascript.Parser;
import org.mozilla.javascript.RhinoException;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Token;
import org.mozilla.javascript.ast.AstRoot;
import org.mozilla.javascript.ast.ScriptNode;
import org.mozilla.javascript.debug.DebuggableScript;
import org.mozilla.javascript.debug.Debugger;

public class EvaluatorFactory {
	private static final Class<?> codegenClass = Kit.classOrNull("org.mozilla.javascript.optimizer.Codegen");
    private static final Class<?> interpreterClass = Kit.classOrNull("org.mozilla.javascript.Interpreter");
	
    public static Evaluator createCompiler(Context cx) {
        if (cx.getOptimizationLevel() >= 0 && codegenClass != null) {
            try {
				return (Evaluator) codegenClass.newInstance();
			} catch (SecurityException | LinkageError | InstantiationException | IllegalAccessException x) {}
        }
        return createInterpreter();
    }
	
	public static Evaluator createInterpreter() {
		try {
			return (Evaluator) interpreterClass.newInstance();
		} catch (SecurityException | LinkageError | InstantiationException | IllegalAccessException x) {}
		return null;
	}
	
	public static ScriptNode parse(Reader sourceReader, String sourceString, String sourceName, int lineno, CompilerEnvirons compilerEnv, ErrorReporter compilationErrorReporter, boolean returnFunction) throws IOException {
		Parser p = new Parser(compilerEnv, compilationErrorReporter);
		if (returnFunction) {
			try {
				Field calledByCompileFunctionField = p.getClass().getDeclaredField("calledByCompileFunction");
				calledByCompileFunctionField.setAccessible(true);
				calledByCompileFunctionField.set(p, true);
			} catch (NoSuchFieldException | IllegalAccessException x) {
				throw new IllegalStateException(x);
			}
        }
        
        AstRoot ast;
		if (sourceString == null) {
			ast = p.parse(sourceReader, sourceName, lineno);
		} else {
			ast = p.parse(sourceString, sourceName, lineno);
		}
		if (returnFunction) {
			// parser no longer adds function to script node
			if (!(ast.getFirstChild() != null && ast.getFirstChild().getType() == Token.FUNCTION)) {
				// XXX: the check just looks for the first child
				// and allows for more nodes after it for compatibility
				// with sources like function() {};;;
				throw new IllegalArgumentException("compileFunction only accepts source with single JS function: " + sourceString);
			}
		}
		
		return new IRFactory(compilerEnv, compilationErrorReporter).transformTree(ast);
	}
	
	public static Object compileImpl(Context cx, Scriptable scope, Reader sourceReader, String sourceString, String sourceName, int lineno, Object securityDomain, boolean returnFunction, Evaluator compiler, ErrorReporter compilationErrorReporter, CompilerEnvirons compilerEnv) throws IOException {
		if (sourceName == null) {
			sourceName = "unnamed script";
		}
		
		try {
			Method getSecurityControllerMethod = cx.getClass().getDeclaredMethod("getSecurityController");
			getSecurityControllerMethod.setAccessible(true);
			if (securityDomain != null && getSecurityControllerMethod.invoke(cx) == null) {
				throw new IllegalArgumentException("securityDomain should be null if setSecurityController() was never called");
			}
		} catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException x) {
			throw new IllegalStateException(x);
		}
		
		// scope should be given if and only if compiling function
		if (!(scope == null ^ returnFunction)) Kit.codeBug();
		
		if (compilerEnv == null) {
			compilerEnv = new CompilerEnvirons();
			compilerEnv.initFromContext(cx);
		}
		if (compilationErrorReporter == null) {
			compilationErrorReporter = compilerEnv.getErrorReporter();
		}
		
		Debugger debugger = cx.getDebugger();
		if (!(debugger == null || sourceReader == null)) {
			sourceString = Kit.readReader(sourceReader);
			sourceReader = null;
		}
		
		ScriptNode tree = parse(sourceReader, sourceString, sourceName, lineno, compilerEnv, compilationErrorReporter, returnFunction);
		if (compiler == null) {
			compiler = createCompiler(cx);
		}
		Object bytecode = compiler.compile(compilerEnv, tree, tree.getEncodedSource(), returnFunction);
		
		if (debugger != null) {
			if (sourceString == null) Kit.codeBug();
			if (bytecode instanceof DebuggableScript) {
				DebuggableScript dscript = (DebuggableScript) bytecode;
				notifyCompilationDone(cx, dscript, sourceString);
			} else {
				throw new RuntimeException("NOT SUPPORTED");
			}
		}
		
		if (returnFunction) {
            return compiler.createFunctionObject(cx, scope, bytecode, securityDomain);
        }
		return compiler.createScriptObject(bytecode, securityDomain);
	}
	
	private static void notifyCompilationDone(Context cx, DebuggableScript dscript, String debugSource) {
		cx.getDebugger().handleCompilationDone(cx, dscript, debugSource);
		for (int i = 0; i != dscript.getFunctionCount(); ++i) {
			notifyCompilationDone(cx, dscript.getFunction(i), debugSource);
		}
	}
	
	public static Script compileReader(Context cx, Reader in, String sourceName, int lineno, Object securityDomain, Evaluator compiler, ErrorReporter compilationErrorReporter, CompilerEnvirons compilerEnv) throws IOException {
		return (Script) compileImpl(cx, null, in, null, sourceName, lineno, securityDomain, false, compiler, compilationErrorReporter, compilerEnv);
	}
	
	public static Object evaluateReader(Context cx, Scriptable scope, Reader in, String sourceName, int lineno, Object securityDomain, Evaluator compiler, ErrorReporter compilationErrorReporter, CompilerEnvirons compilerEnv) throws IOException {
		Script script = compileReader(cx, in, sourceName, lineno, securityDomain, compiler, compilationErrorReporter, compilerEnv);
		if (script != null) {
			return script.exec(cx, scope);
		}
		return null;
	}
	
	public static Script compileString(Context cx, String source, String sourceName, int lineno, Object securityDomain, Evaluator compiler, ErrorReporter compilationErrorReporter, CompilerEnvirons compilerEnv) {
		try {
			return (Script) compileImpl(cx, null, null, source, sourceName, lineno, securityDomain, false, compiler, compilationErrorReporter, compilerEnv);
		} catch (IOException e) {
			// Should not happen when dealing with source as string
			throw new RuntimeException(e);
		}
	}
	
	public static Object evaluateString(Context cx, Scriptable scope, String source, String sourceName, int lineno, Object securityDomain, Evaluator compiler, ErrorReporter compilationErrorReporter, CompilerEnvirons compilerEnv) {
		Script script = compileString(cx, source, sourceName, lineno, securityDomain, compiler, compilationErrorReporter, compilerEnv);
		if (script != null) {
			return script.exec(cx, scope);
		}
		return null;
	}
	
	public static Function compileFunction(Context cx, Scriptable scope, String source, String sourceName, int lineno, Object securityDomain, Evaluator compiler, ErrorReporter compilationErrorReporter, CompilerEnvirons compilerEnv) {
		try {
			return (Function) compileImpl(cx, scope, null, source, sourceName, lineno, securityDomain, true, compiler, compilationErrorReporter, compilerEnv);
		} catch (IOException e) {
			// Should never happen because we just made the reader
			// from a String
			throw new RuntimeException(e);
		}
	}
	
	public static String getClassName(String in) {
		char[] chars = in.toCharArray();
		if (!Character.isJavaIdentifierStart(chars[0])) {
			chars[0] = '$';
		}
		char next;
		for (int i = 0; i < chars.length; i++) {
			next = in.charAt(i);
			if (Character.isJavaIdentifierPart(next)) {
				continue;
			}
			chars[i] = '_';
		}
		return String.valueOf(chars).trim();
	}
	
	@Deprecated
	public static Script evaluateReaderWithCorruptions(Context cx, Scriptable scope, Reader in, String sourceName, int lineno, Object securityDomain) throws IOException {
		Script script = cx.compileReader(in, sourceName, lineno, securityDomain);
		try {
			if (script != null) {
				script.exec(cx, scope);
			}
			return script;
		} catch (Throwable th) {
			if (!(th instanceof RhinoException)) {
				throw new RuntimeException(th);
			}
			CorruptedScript frame = new CorruptedScript();
			// Not working yet... Script just returning second stack line
			// int lineNumber = ((RhinoException) th).lineNumber() - lineno;
			int lineNumber = lineno + 1;
			frame.captureCorruption(lineNumber, th);
			in = new BufferedReader(in);
			in.mark(Integer.MAX_VALUE);
			do {
				for (int i = 0; i < lineNumber; i++) {
					((BufferedReader) in).readLine();
				}
				if (((BufferedReader) in).readLine() == null) {
					break;
				}
				try {
					script = cx.compileReader(in, sourceName, lineno, securityDomain);
					if (script == null) {
						throw new RuntimeException("script == null");
					}
					try {
						frame.endCorruption(lineNumber);
						script.exec(cx, scope);
						break;
					} catch (Throwable e) {
						if (!(e instanceof RhinoException)) {
							throw new RuntimeException(e);
						}
						/*
						lineNumber += ((RhinoException) e).lineNumber();
						*/
						frame.captureCorruption(lineNumber++, e);
					}
				} catch (Throwable e) {
					/*
					if (!(e instanceof RhinoException)) {
						lineNumber++;
						continue;
					}
					lineNumber += ((RhinoException) e).lineNumber();
					*/
					lineNumber++;
				}
				in.reset();
			} while (((BufferedReader) in).ready());
			try {
				((BufferedReader) in).close();
			} catch (Throwable e) {
				e.printStackTrace();
			}
			frame.captureScript(script);
			return frame;
		}
	}
	
	@Deprecated
	public static Script evaluateStringWithCorruptions(Context cx, Scriptable scope, String source, String sourceName, int lineno, Object securityDomain) {
		try {
			return evaluateReaderWithCorruptions(cx, scope, new StringReader(source), sourceName, lineno, securityDomain);
		} catch (IOException e) {
			throw new RuntimeException();
		}
	}
}
