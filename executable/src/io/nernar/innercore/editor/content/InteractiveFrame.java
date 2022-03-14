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

import android.transition.Transition;
import android.view.Gravity;
import android.view.ViewGroup;

public abstract class InteractiveFrame implements Frame {
	
	@Override
	public boolean isTouchable() {
		return true;
	}
	
	@Override
	public boolean isFocusable() {
		return false;
	}
	
	@Override
	public boolean isFullscreen() {
		return false;
	}
	
	@Override
	public int getGravity() {
		return Gravity.NO_GRAVITY;
	}
	
	@Override
	public int getX() {
		return 0;
	}
	
	@Override
	public int getY() {
		return 0;
	}
	
	@Override
	public int getWidth() {
		return ViewGroup.LayoutParams.WRAP_CONTENT;
	}
	
	@Override
	public int getHeight() {
		return ViewGroup.LayoutParams.WRAP_CONTENT;
	}
	
	@Override
	public Transition getEnterTransition() {
		return null;
	}
	
	@Override
	public Transition getExitTransition() {
		return null;
	}
}
