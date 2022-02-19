package com.nernar.innercore.editor.content;

import android.view.View;

public interface Container {
	
	public View getContainer();
	
	public View findViewById(int id);
	
	public View requireViewById(int id);
	
	public View findViewWithTag(Object tag);
	
	public View requireViewWithTag(Object tag);
}
