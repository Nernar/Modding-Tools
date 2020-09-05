package com.nernar.engine.build.mod;

import android.support.annotation.Nullable;
import com.nernar.engine.build.AdvancedCompilerConfig;
import com.nernar.engine.build.enums.LanguageVersion;
import com.zhekasmirnov.innercore.mod.build.BuildConfig;
import org.json.JSONException;
import org.json.JSONObject;
import org.mozilla.javascript.Context;

public class AdvancedBuildConfig extends BuildConfig {
	public static LanguageVersion validateLanguageVersion(int code) {
		try {
			Context.checkLanguageVersion(code);
			return LanguageVersion.find(code);
		} catch (RuntimeException e) {
			return LanguageVersion.DEFAULT;
		}
	}
	
	public static LanguageVersion validateLanguageVersion(LanguageVersion version) {
		return validateLanguageVersion(version.toCode());
	}
	
	public static LanguageVersion getLanguageVersionFromJSON(JSONObject obj) {
        if (obj.has("languageVersion")) {
            return validateLanguageVersion(obj.optInt("languageVersion", LanguageVersion.UNKNOWN.toCode()));
        }
        return LanguageVersion.ES6;
    }
}
