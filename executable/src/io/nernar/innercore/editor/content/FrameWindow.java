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
