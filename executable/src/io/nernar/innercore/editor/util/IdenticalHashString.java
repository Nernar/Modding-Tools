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
package io.nernar.innercore.editor.util;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class IdenticalHashString {
	
	public static long getNextLong(long offset, String who, int hash) {
		while (offset < Long.MAX_VALUE) {
			offset++;
			String where = String.valueOf(offset);
			if (where.hashCode() == hash && where != who) {
				return offset;
			}
		}
		throw new RuntimeException("Couldn't identical same " + hash + " hash code");
	}
	
	public static long getNextLong(long offset, int hash) {
		return getNextLong(offset, null, hash);
	}
	
	public static long getNextLong(long offset, String who) {
		return getNextLong(offset, who, who.hashCode());
	}
	
	public static long getNextLong(String who, int hash) {
		return getNextLong(0, who, hash);
	}
	
	public static long getNextLong(int hash) {
		return getNextLong(null, hash);
	}
	
	public static long getNextLong(String who) {
		return getNextLong(who, who.hashCode());
	}
	
	private static int between(Random random, int min, int max) {
		return (int) (min + random.nextFloat() * (max - min + 1));
	}
	
	private static String getNextRandomString(Random random, int size) {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < size; i++) {
			sb.append((char) between(random, 'a', 'Z'));
		}
		return sb.toString();
	}
	
	public static String getNextString(int size, String who, int hash) {
		if (size <= 0) {
			throw new IllegalArgumentException("String size must be >= 1, not " + size);
		}
		Random random = new Random();
		short iteration = 0;
		while (true) {
			iteration++;
			String where = getNextRandomString(random, size);
			if (where.hashCode() == hash && where != who) {
				return where;
			}
			if (iteration == Short.MAX_VALUE) {
				iteration = 0;
				size++;
			}
		}
	}
	
	public static String getNextString(int size, int hash) {
		return getNextString(size, null, hash);
	}
	
	public static String getNextString(int size, String who) {
		return getNextString(size, who, who.hashCode());
	}
	
	public static String getNextString(String who, int hash) {
		return getNextString(1, who, hash);
	}
	
	public static String getNextString(int hash) {
		return getNextString(null, hash);
	}
	
	public static String getNextString(String who) {
		return getNextString(who, who.hashCode());
	}
	
	public static String revert(String who, int hash) {
		char[] source = who.toCharArray();
		Character[] where = new Character[source.length];
		for (int i = 0; i < source.length; i++) {
			where[i] = Character.valueOf(source[i]);
		}
		List<Character> sort = Arrays.asList(where);
		while (true) {
			Collections.shuffle(sort);
			StringBuilder sb = new StringBuilder();
			for (Character ch : sort) {
				sb.append(ch.charValue());
			}
			String result = sb.toString();
			if (result.hashCode() == hash && result != who) {
				return result;
			}
		}
	}
	
	public static String revert(String who) {
		return revert(who, who.hashCode());
	}
}
