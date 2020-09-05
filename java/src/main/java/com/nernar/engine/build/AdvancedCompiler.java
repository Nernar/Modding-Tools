package com.nernar.engine.build;

import com.faendir.rhino_android.AndroidClassLoader;
import com.zhekasmirnov.innercore.api.log.ICLog;
import com.zhekasmirnov.innercore.api.mod.API;
import com.zhekasmirnov.innercore.api.mod.ScriptableObjectHelper;
import com.zhekasmirnov.innercore.mod.build.BuildConfig;
import com.zhekasmirnov.innercore.mod.build.BuildHelper;
import com.zhekasmirnov.innercore.mod.build.CompiledSources;
import com.zhekasmirnov.innercore.mod.build.Mod;
import com.zhekasmirnov.innercore.mod.executable.Compiler;
import com.zhekasmirnov.innercore.mod.executable.CompilerConfig;
import com.zhekasmirnov.innercore.mod.executable.Executable;
import com.zhekasmirnov.innercore.mod.executable.MultidexScript;
import com.zhekasmirnov.innercore.mod.executable.library.Library;
import com.zhekasmirnov.innercore.ui.LoadingUI;
import com.zhekasmirnov.innercore.utils.IMessageReceiver;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Iterator;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.ScriptableObject;

public class AdvancedCompiler extends Compiler {
	public static Context enter(int level) {
		return enter(level, Context.VERSION_ES6);
	}
	
    public static Context enter(int level, int version) {
		Context ctx = Compiler.enter(level);
		ctx.setLanguageVersion(version);
		return ctx;
	}
	
	public static Context assureContextForCurrentThread() {
		Context ctx = Context.getCurrentContext();
        if (ctx == null) {
            return enter(9);
        }
        return ctx;
	}
	
	public static AdvancedExecutable compileReader(Reader input, AdvancedCompilerConfig compilerConfig) throws IOException {
        Context ctx = enter(compilerConfig.getOptimizationLevel(), compilerConfig.getLanguageVersion());
        LoadingUI.setTip("Compiling " + compilerConfig.getFullName());
        Script script = ctx.compileReader(input, compilerConfig.getFullName(), 0, (Object) null);
        LoadingUI.setTip("");
        return wrapScript(ctx, script, compilerConfig);
	}
	
	public static Executable compileReader(Reader input, CompilerConfig compilerConfig) throws IOException {
		return compileReader(input, compilerConfig);
	}
	
	protected static AdvancedExecutable wrapScript(Context ctx, Script script, AdvancedCompilerConfig compilerConfig) {
        API apiInstance = compilerConfig.getApiInstance();
        ScriptableObject scope = ctx.initStandardObjects(apiInstance == null ? ScriptableObjectHelper.createEmpty() : apiInstance.newInstance(), false);
        if (compilerConfig.isLibrary) {
            return (AdvancedExecutable) (Executable) new Library(ctx, script, scope, (CompilerConfig) compilerConfig, compilerConfig.getApiInstance());
        }
        if (apiInstance != null) {
            apiInstance.injectIntoScope(scope);
        }
        return new AdvancedExecutable(ctx, script, scope, (CompilerConfig) compilerConfig, compilerConfig.getApiInstance());
    }
	
	protected static Executable wrapScript(Context ctx, Script script, CompilerConfig compilerConfig) {
		return wrapScript(ctx, script, compilerConfig);
	}
	
	public static AdvancedExecutable loadDexList(File[] dexes, AdvancedCompilerConfig compilerConfig) {
        Context ctx = enter(compilerConfig.getOptimizationLevel());
        MultidexScript multidex = new MultidexScript();
        LoadingUI.setTip("Wrapping " + compilerConfig.getFullName());
        for (File dex : dexes) {
            try {
                Script script = loadScriptFromDex(dex);
                if (script != null) {
                    multidex.addScript(script);
                }
            } catch (IOException e) {
                ICLog.e("ADV-COMPILER", "failed to load dex file into multi-dex executable: file=" + dex, e);
            }
        }
        if (multidex.getScriptCount() == 0) {
            return null;
        }
        AdvancedExecutable exec = wrapScript(ctx, multidex, compilerConfig);
        exec.isLoadedFromDex = true;
        LoadingUI.setTip("");
        return exec;
    }
	
	public static Executable loadDexList(File[] dexes, CompilerConfig compilerConfig) {
		return loadDexList(dexes, compilerConfig);
	}
	
    protected static String genUniqueId() {
        return Integer.toHexString((int) (Math.random() * 1.6777216E7d)) + "_" + Integer.toHexString((int) (Math.random() * 1.6777216E7d));
    }

    public static void compileScriptToFile(Reader input, String name, String targetFile) throws IOException {
        AndroidClassLoader.enterCompilationMode(targetFile);
        enter(9).compileReader(input, name + "_" + genUniqueId(), 0, (Object) null);
        AndroidClassLoader.exitCompilationMode();
    }
	
	public static boolean compileMod(Mod mod, IMessageReceiver logger) {
        if (logger == null) {
            logger = new IMessageReceiver() {
                public void message(String string) {
                    ICLog.i("ADV-COMPILER", string);
                }
            };
        }
        BuildConfig buildConfig = mod.buildConfig;
        ArrayList<BuildConfig.Source> sourceList = buildConfig.getAllSourcesToCompile();
        CompiledSources compiledSources = mod.createCompiledSources();
        logger.message("compiling mod " + mod.getName() + " (" + sourceList.size() + " source files)");
        logger.message("cleaning up");
        compiledSources.reset();
        boolean isSucceeded = true;
        int uuid = 1;
        Iterator<BuildConfig.Source> it = sourceList.iterator();
        while (it.hasNext()) {
            BuildConfig.Source source = it.next();
            logger.message("compiling source: path=" + source.path + " type=" + source.sourceType);
            BuildConfig.BuildableDir relatedDir = buildConfig.findRelatedBuildableDir(source);
            ArrayList<File> sourceFiles = null;
            if (relatedDir != null) {
                try {
                    sourceFiles = BuildHelper.readIncludesFile(new File(mod.dir, relatedDir.dir));
                } catch (IOException e) {
                    logger.message("failed read includes, compiling result file: " + e);
                }
            }
            if (sourceFiles == null) {
                sourceFiles = new ArrayList<>();
                sourceFiles.add(new File(mod.dir + source.path));
            }
            for (int i = 0; i < sourceFiles.size(); i++) {
                File file = sourceFiles.get(i);
                try {
                    logger.message("$compiling: " + file.getName() + " (" + (i + 1) + "/" + sourceFiles.size() + ")");
                    FileReader reader = new FileReader(file);
                    int uuid2 = uuid + 1;
                    try {
                        File target = compiledSources.getTargetCompilationFile(uuid + "");
                        compileScriptToFile(reader, mod.getName() + "$" + source.sourceName + "$" + file.getName(), target.getAbsolutePath());
                        compiledSources.addCompiledSource(source.path, target, source.sourceName);
                    } catch (Exception e) {
                        e.printStackTrace();
                        logger.message("failed: " + e);
                        isSucceeded = false;
                    }
					uuid = uuid2;
                } catch (Exception e) {
                    e.printStackTrace();
                    logger.message("failed: " + e);
                    isSucceeded = false;
                }
            }
        }
        logger.message("compilation finished");
        return isSucceeded;
    }
}
