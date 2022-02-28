package io.nernar.innercore.editor.content;

public interface Window extends Frame {
	
	public boolean isOpened();
	
	public void attach();
	
	public void update();
	
	public void dismiss();
}
