package com.nernar.engine.build;

import com.zhekasmirnov.innercore.mod.executable.MultidexScript;
import java.util.ArrayList;
import java.util.Iterator;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;

public class AdvancedMultidexScript extends MultidexScript {
    protected ArrayList<Script> scripts = new ArrayList<>();
	
	@Override
    public void addScript(Script script) {
        scripts.add(script);
    }
	
	@Override
    public int getScriptCount() {
        return scripts.size();
    }
	
	@Override
    public Object exec(Context context, Scriptable scriptable) {
        Object result = null;
        Context ctx = AdvancedCompiler.assureContextForCurrentThread();
        Iterator<Script> it = this.scripts.iterator();
        while (it.hasNext()) {
            Object run = it.next().exec(ctx, scriptable);
            if (run != null) {
                result = run;
            }
        }
        return result;
    }
}
