package com.nernar.engine.build;

import com.zhekasmirnov.innercore.api.mod.API;
import com.zhekasmirnov.innercore.mod.executable.CompilerConfig;
import com.zhekasmirnov.innercore.mod.executable.Executable;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.ScriptableObject;

public class AdvancedExecutable extends Executable {
    public AdvancedExecutable(Context context, Script script, ScriptableObject scriptScope, CompilerConfig config, API apiInstance) {
        super(context, script, scriptScope, config, apiInstance);
    }

    public AdvancedExecutable(Context context, ScriptableObject scriptScope, CompilerConfig config, API apiInstance) {
        super(context, scriptScope, config, apiInstance);
    }

	@Override
	protected Object runScript() {
		return script.exec(AdvancedCompiler.assureContextForCurrentThread(), scriptScope);
	}
}
