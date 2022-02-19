package com.nernar.innercore.editor.content;

public abstract class FramePopup extends FrameWindow implements Popup {
	
	@Override
	public boolean isMayDismissed() {
		return true;
	}
	
	@Override
	public boolean isMayCollapsed() {
		return true;
	}
	
	@Override
	public boolean isMayDragged() {
		return true;
	}
}
