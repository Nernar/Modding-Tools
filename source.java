package zhekasmirnov.launcher.mod.executable;

import com.faendir.rhino_android.AndroidClassLoader;
import com.faendir.rhino_android.AndroidContextFactory;
import com.faendir.rhino_android.RhinoAndroidHelper;
import dalvik.system.DexFile;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Iterator;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.ScriptableObject;
import zhekasmirnov.launcher.api.log.ICLog;
import zhekasmirnov.launcher.api.mod.API;
import zhekasmirnov.launcher.api.mod.ScriptableObjectHelper;
import zhekasmirnov.launcher.mod.build.BuildConfig;
import zhekasmirnov.launcher.mod.build.BuildConfig.BuildableDir;
import zhekasmirnov.launcher.mod.build.BuildConfig.Source;
import zhekasmirnov.launcher.mod.build.BuildHelper;
import zhekasmirnov.launcher.mod.build.CompiledSources;
import zhekasmirnov.launcher.mod.build.Mod;
import zhekasmirnov.launcher.mod.executable.library.Library;
import zhekasmirnov.launcher.ui.LoadingUI;
import zhekasmirnov.launcher.utils.IMessageReceiver;

public class Compiler {
    private static File classCacheDir = new File(System.getProperty("java.io.tmpdir", "."), "classes");
    private static Context defaultContext = null;
    private static RhinoAndroidHelper rhinoAndroidHelper;
    private static int tempDexCounter = 0;

    public static Context assureContextForCurrentThread() {
        Context currentContext = Context.getCurrentContext();
        return currentContext == null ? enter(9) : currentContext;
    }

    public static boolean compileMod(Mod mod, IMessageReceiver iMessageReceiver) {
        Exception e;
        if (iMessageReceiver == null) {
            iMessageReceiver = new 1();
        }
        BuildConfig buildConfig = mod.buildConfig;
        ArrayList allSourcesToCompile = buildConfig.getAllSourcesToCompile();
        CompiledSources createCompiledSources = mod.createCompiledSources();
        iMessageReceiver.message("compiling mod " + mod.getName() + " (" + allSourcesToCompile.size() + " source files)");
        iMessageReceiver.message("cleaning up");
        createCompiledSources.reset();
        Iterator it = allSourcesToCompile.iterator();
        boolean z = true;
        int i = 1;
        while (it.hasNext()) {
            ArrayList arrayList;
            Source source = (Source) it.next();
            iMessageReceiver.message("compiling source: path=" + source.path + " type=" + source.sourceType);
            BuildableDir findRelatedBuildableDir = buildConfig.findRelatedBuildableDir(source);
            ArrayList arrayList2 = null;
            if (findRelatedBuildableDir != null) {
                try {
                    arrayList2 = BuildHelper.readIncludesFile(new File(mod.dir, findRelatedBuildableDir.dir));
                } catch (IOException e2) {
                    iMessageReceiver.message("failed read includes, compiling result file: " + e2);
                    arrayList2 = null;
                }
            }
            if (arrayList2 == null) {
                arrayList2 = new ArrayList();
                arrayList2.add(new File(mod.dir + source.path));
                arrayList = arrayList2;
            } else {
                arrayList = arrayList2;
            }
            boolean z2 = z;
            int i2 = i;
            for (int i3 = 0; i3 < arrayList.size(); i3++) {
                File file = (File) arrayList.get(i3);
                try {
                    iMessageReceiver.message("$compiling: " + file.getName() + " (" + (i3 + 1) + "/" + arrayList.size() + ")");
                    Reader fileReader = new FileReader(file);
                    int i4 = i2 + 1;
                    try {
                        File targetCompilationFile = createCompiledSources.getTargetCompilationFile(i2 + "");
                        compileScriptToFile(fileReader, mod.getName() + "$" + source.sourceName + "$" + file.getName(), targetCompilationFile.getAbsolutePath());
                        createCompiledSources.addCompiledSource(source.path, targetCompilationFile, source.sourceName);
                        i2 = i4;
                    } catch (Exception e3) {
                        e = e3;
                        i2 = i4;
                        e.printStackTrace();
                        iMessageReceiver.message("failed: " + e);
                        z2 = false;
                    }
                } catch (Exception e4) {
                    e = e4;
                    e.printStackTrace();
                    iMessageReceiver.message("failed: " + e);
                    z2 = false;
                }
            }
            i = i2;
            z = z2;
        }
        iMessageReceiver.message("compilation finished");
        return z;
    }

    public static Executable compileReader(Reader reader, CompilerConfig compilerConfig) throws IOException {
        Context enter = enter(compilerConfig.getOptimizationLevel());
        LoadingUI.setTip("Compiling " + compilerConfig.getFullName());
        Script compileReader = enter.compileReader(reader, compilerConfig.getFullName(), 0, null);
        LoadingUI.setTip("");
        return wrapScript(enter, compileReader, compilerConfig);
    }

    public static void compileScriptToFile(Reader reader, String str, String str2) throws IOException {
        AndroidClassLoader.enterCompilationMode(str2);
        enter(9).compileReader(reader, str + "_" + genUniqueId(), 0, null);
        AndroidClassLoader.exitCompilationMode();
    }

    public static Context enter(int i) {
        if (rhinoAndroidHelper == null) {
            rhinoAndroidHelper = new RhinoAndroidHelper();
        }
        Context enterContext = rhinoAndroidHelper.enterContext();
        enterContext.setOptimizationLevel(i);
        enterContext.setLanguageVersion(200);
        return enterContext;
    }

    private static String genUniqueId() {
        return Integer.toHexString((int) (Math.random() * 1.6777216E7d)) + "_" + Integer.toHexString((int) (Math.random() * 1.6777216E7d));
    }

    public static Context getDefaultContext() {
        if (defaultContext == null) {
            defaultContext = Context.enter();
        }
        return defaultContext;
    }

    public static Executable loadDex(File file, CompilerConfig compilerConfig) throws IOException {
        Context enter = enter(compilerConfig.getOptimizationLevel());
        Script loadScriptFromDex = loadScriptFromDex(file);
        if (loadScriptFromDex == null) {
            return null;
        }
        Executable wrapScript = wrapScript(enter, loadScriptFromDex, compilerConfig);
        wrapScript.isLoadedFromDex = true;
        return wrapScript;
    }

    public static Executable loadDexList(File[] fileArr, CompilerConfig compilerConfig) {
        Context enter = enter(compilerConfig.getOptimizationLevel());
        MultidexScript multidexScript = new MultidexScript();
        LoadingUI.setTip("Wrapping " + compilerConfig.getFullName());
        for (File file : fileArr) {
            try {
                Script loadScriptFromDex = loadScriptFromDex(file);
                if (loadScriptFromDex != null) {
                    multidexScript.addScript(loadScriptFromDex);
                }
            } catch (Throwable e) {
                ICLog.e("COMPILER", "failed to load dex file into multi-dex executable: file=" + file, e);
            }
        }
        if (multidexScript.getScriptCount() == 0) {
            return null;
        }
        Executable wrapScript = wrapScript(enter, multidexScript, compilerConfig);
        wrapScript.isLoadedFromDex = true;
        LoadingUI.setTip("");
        return wrapScript;
    }

    public static Script loadScriptFromDex(File file) throws IOException {
        String property = System.getProperty("java.io.tmpdir", ".");
        StringBuilder append = new StringBuilder().append("classes/ic-dex-cache");
        int i = tempDexCounter;
        tempDexCounter = i + 1;
        DexFile loadDex = DexFile.loadDex(file.getAbsolutePath(), new File(property, append.append(i).toString()).getAbsolutePath(), 0);
        Enumeration entries = loadDex.entries();
        String str = null;
        while (entries.hasMoreElements()) {
            property = (String) entries.nextElement();
            if (str == null) {
                str = property;
            } else {
                throw new IOException("invalid compiled js dex file: more than one class entries (" + str + ", " + property + ")");
            }
        }
        if (str == null) {
            throw new IOException("invalid compiled js dex file: no class entries found");
        }
        try {
            return (Script) loadDex.loadClass(str, AndroidContextFactory.class.getClassLoader()).newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e2) {
            e2.printStackTrace();
        }
        ICLog.d("COMPILER", "dex loading failed: " + str);
        return null;
    }

    private static Executable wrapScript(Context context, Script script, CompilerConfig compilerConfig) {
        API apiInstance = compilerConfig.getApiInstance();
        ScriptableObject initStandardObjects = context.initStandardObjects(apiInstance == null ? ScriptableObjectHelper.createEmpty() : apiInstance.newInstance(), false);
        if (compilerConfig.isLibrary) {
            return new Library(context, script, initStandardObjects, compilerConfig, compilerConfig.getApiInstance());
        }
        if (apiInstance != null) {
            apiInstance.injectIntoScope(initStandardObjects);
        }
        return new Executable(context, script, initStandardObjects, compilerConfig, compilerConfig.getApiInstance());
    }
}