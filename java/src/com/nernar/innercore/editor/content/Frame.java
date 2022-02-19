package com.nernar.innercore.editor.content;

import android.transition.Transition;

public interface Frame {
	
	public Container getContainer();
	
	public boolean isTouchable();
	
	public boolean isFocusable();
	
	public boolean isFullscreen();
	
	public int getGravity();
	
	public int getX();
	
	public int getY();
	
	public int getWidth();
	
	public int getHeight();
	
	public Transition getEnterTransition();
	
	public Transition getExitTransition();
}
