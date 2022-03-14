/*

   Copyright 2022 Nernar (github.com/nernar)
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
package io.nernar.innercore.editor.text;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;

public class InternalTranslation {
    
	private static HashMap<Integer, String> currentLanguageTranslations;
	private static HashMap<Integer, String> defaultLanguageTranslations;
	
    static {
		Class<?> clazz = getNameTranslationClass();
		try {
			Field currentLanguageTranslations = clazz.getDeclaredField("currentLanguageTranslations");
			currentLanguageTranslations.setAccessible(true);
			InternalTranslation.currentLanguageTranslations = (HashMap<Integer, String>) currentLanguageTranslations.get(null);
			Field defaultLanguageTranslations = clazz.getDeclaredField("defaultLanguageTranslations");
			defaultLanguageTranslations.setAccessible(true);
			InternalTranslation.defaultLanguageTranslations = (HashMap<Integer, String>) defaultLanguageTranslations.get(null);
		} catch (NoSuchFieldException | IllegalAccessException e) {}
	}
	
	private static Class<?> getNameTranslationClass() {
		try {
			return com.zhekasmirnov.innercore.api.runtime.other.NameTranslation.class;
		} catch (NoClassDefFoundError e) {}
		try {
			return Class.forName("zhekasmirnov.innercore.api.runtime.other.NameTranslation",
								 true, InternalTranslation.class.getClassLoader());
		} catch (ClassNotFoundException e) {
			throw new RuntimeException(e);
		}
	}
	
	public static String translate(String translation) {
		Class<?> clazz = getNameTranslationClass();
		try {
			Method translate = clazz.getMethod("translate", String.class);
			return (String) translate.invoke(null, translation);
		} catch (NoSuchMethodException | SecurityException | IllegalAccessException
				 | IllegalArgumentException | InvocationTargetException e) {
			throw new RuntimeException(e);
		}
	}
	
	public static String translateCode(Integer hash, String fallback) {
		if (currentLanguageTranslations != null) {
			String translation = currentLanguageTranslations.get(hash);
			if (translation != null) {
				return translation;
			}
		}
		if (defaultLanguageTranslations != null) {
			String translation = defaultLanguageTranslations.get(hash);
			if (translation != null) {
				return translation;
			}
		}
		if (fallback != null) {
			return fallback;
		}
		return translate("Deprecated translation");
	}
	
	public static String translateCode(int hash, String fallback) {
		return translateCode(Integer.valueOf(hash), fallback);
	}
}
