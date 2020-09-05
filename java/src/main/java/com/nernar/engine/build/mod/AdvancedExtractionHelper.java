package com.nernar.engine.build.mod;

import android.os.Build;
import com.nernar.engine.build.AdvancedCompiler;
import com.nernar.engine.build.AdvancedCompilerConfig;
import com.nernar.engine.build.AdvancedExecutable;
import com.zhekasmirnov.horizon.runtime.logger.Logger;
import com.zhekasmirnov.innercore.api.mod.API;
import com.zhekasmirnov.innercore.api.mod.util.ScriptableFunctionImpl;
import com.zhekasmirnov.innercore.api.runtime.other.PrintStacking;
import com.zhekasmirnov.innercore.mod.build.BuildConfig;
import com.zhekasmirnov.innercore.mod.build.ExtractionHelper;
import com.zhekasmirnov.innercore.utils.FileTools;
import com.zhekasmirnov.innercore.utils.IMessageReceiver;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.NoSuchElementException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class AdvancedExtractionHelper extends ExtractionHelper {
    private static ArrayList<String> extractionPathList = new ArrayList<>();

    protected static String searchForSubPath(ZipFile modArchiveFile, String searchFor) {
        ZipEntry entry;
        Enumeration<? extends ZipEntry> entries = modArchiveFile.entries();
        while (entries.hasMoreElements() && (entry = entries.nextElement()) != null) {
            String name = entry.getName();
            Logger.debug("DEBUG", "searching: " + name);
            if (name.endsWith(searchFor)) {
                return name.substring(0, name.length() - searchFor.length());
            }
        }
        return null;
    }

    protected static String extractAs(ZipFile modArchiveFile, String subPath, String dirName) throws IOException {
        if (dirName == null || dirName.length() == 0 || dirName.indexOf(92) != -1 || dirName.indexOf(47) != -1) {
            throw new IllegalArgumentException("invalid directory name passed to the method extractAs: '" + dirName + "', it must be not empty and must not contain '\\' or '/' symbols");
        }
        String path = FileTools.DIR_WORK + "mods/" + dirName + "/";
        byte[] buffer = new byte[1024];
        Enumeration<? extends ZipEntry> entries = modArchiveFile.entries();
        while (true) {
            try {
                ZipEntry entry = entries.nextElement();
                if (entry == null) {
                    break;
                }
                String name = entry.getName();
                if (name.startsWith(subPath) && !name.contains(".setup/")) {
                    String name2 = name.substring(subPath.length());
                    if (!entry.isDirectory()) {
                        File out = new File(path, name2);
                        FileTools.assureFileDir(out);
                        InputStream inStream = modArchiveFile.getInputStream(entry);
                        FileOutputStream outStream = new FileOutputStream(out);
                        while (true) {
                            int count = inStream.read(buffer);
                            if (count == -1) {
                                break;
                            }
                            outStream.write(buffer, 0, count);
                        }
                        outStream.close();
                        inStream.close();
                    }
                }
            } catch (NoSuchElementException e) {}
        }
        extractionPathList.add(path);
        return path;
    }
	
    protected static void extractEntry(ZipFile modArchiveFile, String subPath, String entryName, String target) throws IOException {
        ZipEntry entry = modArchiveFile.getEntry(subPath + entryName);
        if (entry == null) {
            throw new IllegalArgumentException("entry " + subPath + entryName + " does not exist for file " + modArchiveFile);
        }
        FileTools.assureFileDir(new File(target));
        Logger.debug("DEBUG", "started entry extraction " + subPath + entryName);
        byte[] buffer = new byte[1024];
        InputStream inStream = modArchiveFile.getInputStream(entry);
        FileOutputStream outStream = new FileOutputStream(target);
        while (true) {
            int count = inStream.read(buffer);
            if (count != -1) {
                outStream.write(buffer, 0, count);
            } else {
                outStream.close();
                inStream.close();
                return;
            }
        }
    }
	
    protected static void runSetupScript(final ZipFile modArchiveFile, final String subPath, File setupScriptFile, final String defaultDir, final IMessageReceiver logger) throws Exception {
        AdvancedExecutable setupScript = AdvancedCompiler.compileReader(new FileReader(setupScriptFile), new AdvancedCompilerConfig((API) null));
        ScriptableObject scope = setupScript.getScope();
        scope.put("extractAs", scope, new ScriptableFunctionImpl() {
			public Object call(Context context, Scriptable scriptable, Scriptable scriptable1, Object[] args) {
				String name = (String) (args.length > 0 ? args[0] : null);
				String dir = name != null ? name : defaultDir;
				try {
					logger.message("extracting mod to ...mods/" + dir);
					return extractAs(modArchiveFile, subPath, dir);
				} catch (IOException e) {
					throw new RuntimeException(e);
				}
			}
		});
        scope.put("unpack", scope, new ScriptableFunctionImpl() {
			public Object call(Context context, Scriptable scriptable, Scriptable scriptable1, Object[] args) {
				try {
					extractEntry(modArchiveFile, subPath, String.valueOf(args[0]), String.valueOf(args[1]));
					return null;
				} catch (IOException e) {
					throw new RuntimeException(e);
				}
			}
		});
        scope.put("log", scope, new ScriptableFunctionImpl() {
			public Object call(Context context, Scriptable scriptable, Scriptable scriptable1, Object[] objects) {
				StringBuilder output = new StringBuilder();
				for (Object obj : objects) {
					output.append(obj).append(" ");
				}
				logger.message(output.toString());
				return null;
			}
		});
        scope.put("print", scope, new ScriptableFunctionImpl() {
			public Object call(Context context, Scriptable scriptable, Scriptable scriptable1, Object[] objects) {
				int length = objects.length;
				for (int i = 0; i < length; i++) {
					PrintStacking.print(objects[i] + "");
				}
				return null;
			}
		});
        scope.put("__modsdir__", scope, FileTools.DIR_WORK + "mods/");
        scope.put("__subpath__", scope, subPath);
        setupScript.run();
        Throwable throwable = setupScript.getLastRunException();
        if (throwable != null) {
            throw new RuntimeException(throwable);
        }
    }
	
    public static synchronized ArrayList<String> extractICModFile(File file, IMessageReceiver logger, Runnable readyToInstallCallback) {
        ArrayList<String> arrayList;
        ZipFile modArchiveFile;
        String defaultDir;
        synchronized (ExtractionHelper.class) {
            logger.message("preparing to install " + file.getName());
            extractionPathList.clear();
            try {
                if (Build.VERSION.SDK_INT >= 24) {
                    modArchiveFile = new ZipFile(file, Charset.forName("UTF-8"));
                } else {
                    modArchiveFile = new ZipFile(file);
                }
                String subPath = searchForSubPath(modArchiveFile, "build.config");
                if (subPath == null) {
                    logger.message("mod archive has incorrect structure: build.config file was not found anywhere");
                    arrayList = null;
                } else {
                    logger.message("mod installation dir was found at path '/" + subPath + "'");
                    logger.message("extracting installation files");
                    for (String[] f : new String[][]{new String[]{"cfg", "build.config"}, new String[]{"icon", "mod_icon.png"}, new String[]{"info", "mod.info"}}) {
                        File tmp = new File(TEMP_DIR, f[0]);
                        if (tmp.exists()) {
                            tmp.delete();
                        }
                        try {
                            extractEntry(modArchiveFile, subPath, f[1], TEMP_DIR + f[0]);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                    BuildConfig buildConfig = new BuildConfig(new File(TEMP_DIR, "cfg"));
                    if (!buildConfig.read()) {
                        logger.message("build config cannot be loaded correctly, it failed to extract or was corrupted");
                        arrayList = null;
                    } else {
                        logger.message("we are ready to install");
                        if (readyToInstallCallback != null) {
                            readyToInstallCallback.run();
                        }
                        String setupScriptDir = buildConfig.defaultConfig.setupScriptDir;
                        if (subPath.length() > 0) {
                            int slashIndex = Math.max(subPath.indexOf(47), subPath.indexOf(92));
                            if (slashIndex == -1) {
                                slashIndex = subPath.length();
                            }
                            defaultDir = subPath.substring(0, slashIndex);
                        } else {
                            defaultDir = file.getName();
                            if (defaultDir.endsWith(".icmod")) {
                                defaultDir = defaultDir.substring(0, defaultDir.length() - 6);
                            }
                        }
                        logger.message("installing mod (default directory name is '" + defaultDir + "', but it probably will change).");
                        if (setupScriptDir != null) {
                            try {
                                extractEntry(modArchiveFile, subPath, setupScriptDir, TEMP_DIR + "setup");
                                logger.message("running setup script");
                                try {
                                    runSetupScript(modArchiveFile, subPath, new File(TEMP_DIR, "setup"), defaultDir, logger);
                                } catch (Throwable th) {
                                    logger.message("failed to run setup script: " + th);
                                    arrayList = null;
                                }
                            } catch (Exception e) {
                                logger.message("failed to extract setup script: " + e);
                                arrayList = null;
                            }
                        } else {
                            try {
                                logger.message("extracting mod to ...mods/" + defaultDir);
                                extractAs(modArchiveFile, subPath, defaultDir);
                            } catch (IOException e3) {
                                logger.message("failed to extract mod archive: " + e3);
                                arrayList = null;
                            }
                        }
                        arrayList = extractionPathList;
                    }
                }
            } catch (ZipException e) {
                logger.message("mod archive is corrupt: " + e);
                e.printStackTrace();
                arrayList = null;
            } catch (IOException e) {
                logger.message("io exception occurred: " + e);
                e.printStackTrace();
                arrayList = null;
            }
        }
        return arrayList;
    }
}
