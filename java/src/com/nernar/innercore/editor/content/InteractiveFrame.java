package com.nernar.innercore.editor.content;

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
