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

public abstract class FrameWindow implements Window {
	
	public abstract Frame getFrame();
	
	@Override
	public Container getContainer() {
		Frame frame = getFrame();
		if (frame != null) {
			return frame.getContainer();
		}
		return null;
	}
	
	@Override
	public boolean isFullscreen() {
		Frame frame = getFrame();
		if (frame != null) {
			return frame.isFullscreen();
		}
		return false;
	}

	@Override
	public int getGravity() {
		Frame frame = getFrame();
		if (frame != null) {
			return frame.getGravity();
		}
		return Gravity.NO_GRAVITY;
	}

	@Override
	public int getX() {
		Frame frame = getFrame();
		if (frame != null) {
			return frame.getX();
		}
		return 0;
	}

	@Override
	public int getY() {
		Frame frame = getFrame();
		if (frame != null) {
			return frame.getY();
		}
		return 0;
	}
	
	@Override
	public boolean isTouchable() {
		Frame frame = getFrame();
		if (frame != null) {
			return frame.isTouchable();
		}
		return false;
	}
	
	@Override
	public boolean isFocusable() {
		Frame frame = getFrame();
		if (frame != null) {
			return frame.isFocusable();
		}
		return false;
	}
	
	@Override
	public int getWidth() {
		Frame frame = getFrame();
		if (frame != null) {
			return frame.getWidth();
		}
		return 0;
	}
	
	@Override
	public int getHeight() {
		Frame frame = getFrame();
		if (frame != null) {
			return frame.getWidth();
		}
		return 0;
	}
	
	@Override
	public Transition getEnterTransition() {
		Frame frame = getFrame();
		if (frame != null) {
			return frame.getEnterTransition();
		}
		return null;
	}
	
	@Override
	public Transition getExitTransition() {
		Frame frame = getFrame();
		if (frame != null) {
			return frame.getExitTransition();
		}
		return null;
	}
}
