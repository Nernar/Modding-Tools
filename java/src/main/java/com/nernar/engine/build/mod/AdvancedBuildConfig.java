package com.nernar.engine.build.mod;

import android.support.annotation.Nullable;
import com.nernar.engine.build.AdvancedCompilerConfig;
import com.nernar.engine.build.enums.LanguageVersion;
import com.zhekasmirnov.innercore.mod.build.BuildConfig;
import org.json.JSONException;
import org.json.JSONObject;
import org.mozilla.javascript.Context;

public class AdvancedBuildConfig extends BuildConfig {
	public AdvancedDefaultConfig defaultConfig = this.defaultConfig;
	
	@Nullable
	public LanguageVersion getLanguageVersion() {
		return defaultConfig.languageVersion;
	}
	
	public static class AdvancedDefaultConfig extends DefaultConfig {
		public LanguageVersion languageVersion;
		
		public void setLanguageVersion(int code) {
			code = validateLanguageVersion(code).toCode();
			try {
				languageVersion = LanguageVersion.find(code);
				json.put("languageVersion", languageVersion.toVersion());
			} catch (JSONException e) {
				e.printStackTrace();
			} catch (NullPointerException e) {
				e.printStackTrace();
			}
		}
		
		public void setLanguageVersion(String version) {
			try {
			    LanguageVersion value = LanguageVersion.find(version);
			    setLanguageVersion(value.toCode()); 
			} catch (NullPointerException e) {
				e.printStackTrace();
			}
		}
		
		public void setLanguageVersion(LanguageVersion version) {
			setLanguageVersion((version != null ? version : LanguageVersion.ES6).toCode());
		}
		
		public static AdvancedDefaultConfig fromJson(JSONObject json) {
            AdvancedDefaultConfig defaultConfig = (AdvancedDefaultConfig) DefaultConfig.fromJson(json);
            defaultConfig.languageVersion = getLanguageVersionFromJSON(json);
			return defaultConfig;
        }
	}
	
    public static class AdvancedSource extends Source {
		public LanguageVersion languageVersion;
		
		public void setLanguageVersion(int code) {
			code = validateLanguageVersion(code).toCode();
			try {
				languageVersion = validateLanguageVersion(code);
				json.put("languageVersion", languageVersion.toVersion());
			} catch (JSONException e) {
				e.printStackTrace();
			} catch (NullPointerException e) {
				e.printStackTrace();
			}
		}

		public void setLanguageVersion(String version) {
			try {
			    LanguageVersion value = LanguageVersion.find(version);
				value = validateLanguageVersion(value);
			    setLanguageVersion(value.toCode()); 
			} catch (NullPointerException e) {
				e.printStackTrace();
			}
		}

		public void setLanguageVersion(LanguageVersion version) {
			setLanguageVersion((version != null ? version : LanguageVersion.ES6).toCode());
		}
		
		@Override
		public AdvancedCompilerConfig getCompilerConfig() {
			AdvancedCompilerConfig config = (AdvancedCompilerConfig) super.getCompilerConfig();
			config.setLanguageVersion(languageVersion.toCode());
			return config;
		}
		
		public static AdvancedSource fromJson(JSONObject json, DefaultConfig config) {
            AdvancedSource source = (AdvancedSource) Source.fromJson(json, config);
			if (json.has("languageVersion")) {
			    source.languageVersion = LanguageVersion.find(json.optString("languageVersion", "es6"));
			} else {
				source.languageVersion = LanguageVersion.ES6;
			}
			return source;
        }
	}
	
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
