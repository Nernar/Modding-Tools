package com.nernar.engine.build;

import com.zhekasmirnov.innercore.api.mod.API;
import com.zhekasmirnov.innercore.mod.executable.CompilerConfig;
import org.mozilla.javascript.Context;

public class AdvancedCompilerConfig extends CompilerConfig {
	private int languageVersion;
	
    public AdvancedCompilerConfig(API apiInstance) {
		super(apiInstance);
	}
	
	public void setLanguageVersion(int version) {
		Context.checkLanguageVersion(version);
		languageVersion = version;
	}
	
	public int getLanguageVersion() {
		return languageVersion;
	}
}
