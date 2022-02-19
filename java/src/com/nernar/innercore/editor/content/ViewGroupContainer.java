package com.nernar.innercore.editor.content;

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
