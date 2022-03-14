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
package io.nernar.innercore.editor.content;

import android.view.View;

public abstract class ViewGroupContainer implements Container {
	
	@Override
	public View findViewById(int id) {
		View container = getContainer();
		if (container != null) {
			return container.findViewById(id);
		}
		return null;
	}
	
	@Override
	public View requireViewById(int id) {
		View view = findViewById(id);
		if (view == null) {
			throw new NullPointerException();
		}
		return view;
	}
	
	@Override
	public View findViewWithTag(Object tag) {
		View container = getContainer();
		if (container != null) {
			return container.findViewWithTag(tag);
		}
		return null;
	}
	
	@Override
	public View requireViewWithTag(Object tag) {
		View view = findViewWithTag(tag);
		if (view == null) {
			throw new NullPointerException();
		}
		return view;
	}
}
