package com.nernar.innercore.editor.content;

public interface Popup extends Window {
	
	public boolean isExpanded();
	
	public void expand();
	
	public void minimize();
	
	public void maximize();
	
	public boolean isMayDismissed();
	
	public boolean isMayCollapsed();
	
	public boolean isMayDragged();
}
