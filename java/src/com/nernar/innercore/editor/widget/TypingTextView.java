/*

   Copyright 2021 Nernar (github.com/nernar)
   
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
package com.nernar.innercore.editor.widget;

import android.content.*;
import android.os.*;
import android.support.annotation.*;
import android.support.v7.widget.*;
import android.text.*;
import android.util.*;

public class TypingTextView extends AppCompatTextView {
	
	private BufferType mTypingBufferType = BufferType.NORMAL;
	private OnTypingListener listener;
	private CharSequence mTypingText;
	private int mIncreaseCount = 1;
	private long mTypingDelay = 20;
	private long mStartupDelay = 200;
	private Handler handler;
	
	public TypingTextView(Context context) {
		super(context);
	}
	
    public TypingTextView(Context context, AttributeSet attrs) {
		super(context, attrs);
	}
	
    public TypingTextView(Context context, AttributeSet attrs, int defStyleAttr) {
		super(context, attrs, defStyleAttr);
	}
	
	public static abstract interface OnTypingListener {
		
		public abstract void onTypingStarted(CharSequence who);
		
		public abstract void onSequenceIncreased(CharSequence sub);
		
		public abstract void onTypingCompleted(int length);
	}
	
	protected final Handler getTypingHandler() {
		return handler;
	}
	
	public void setOnTypingListener(OnTypingListener callback) {
		listener = callback;
	}
	
	public boolean increaseProgress(int index) {
		if (mTypingText == null) {
			return false;
		}
		int total = getTypingTotalCount();
		if (index >= total) {
			throw new IllegalArgumentException("Sub typing index can not be >= length");
		}
		int length = index + getCharIncreaseCount();
		if (length > total) {
			length = total - 1;
		}
		return increaseProgress(index, length);
	}
	
	public final boolean increaseProgress() {
		return increaseProgress(getTypingPosition());
	}
	
	protected boolean increaseProgress(int start, int end) {
		if (mTypingText == null) {
			return false;
		}
		CharSequence sub = mTypingText.subSequence(start, end);
		if (listener != null) {
			listener.onSequenceIncreased(sub);
		}
		CharSequence appended = mTypingText.subSequence(0, end);
		onIncreasedSequence(sub, appended);
		return true;
	}
	
	protected void onIncreasedSequence(CharSequence sub, @NonNull CharSequence who) {
		super.setText(who, mTypingBufferType);
	}
	
	protected void onTypingStarted(CharSequence who) {
		if (listener != null) {
			listener.onTypingStarted(who);
		}
	}
	
	protected void onTypingCompleted(int length) {
		if (listener != null) {
			listener.onTypingCompleted(length);
		}
	}
	
	public void invalidateTyping() {
		if (handler == null) {
			return;
		}
		handler.removeMessages(0x767);
		if (mTypingText == null) {
			return;
		}
		Message invalidate = Message.obtain();
		invalidate.what = 0x767;
		long delay = getTypingStartupDelay();
		if (delay > 0) {
			handler.sendMessageDelayed(invalidate, delay);
		} else {
			handler.sendMessage(invalidate);
		}
	}
	
	@Override
	public void setText(CharSequence text, BufferType type) {
		if (text == null) {
			text = new String();
		}
		if (handler != null) {
			handler.removeMessages(0x767);
		}
		mTypingText = text;
		mTypingBufferType = type;
		super.setText(new String(), type);
		invalidateTyping();
	}
	
	@Override
	public void append(CharSequence text, int start, int end) {
		if (text == null) {
			text = new String();
		}
		if (start < 0 || end < 0 || start + end > text.length()) {
			throw new IndexOutOfBoundsException(start + ", " + end);
		}
		mTypingBufferType = BufferType.EDITABLE;
		if (!(mTypingText instanceof Editable)) {
			synchronized (handler) {
				CharSequence mRealText = getTypedText();
				super.setText(mTypingText, mTypingBufferType);
				mTypingText = getTypedText();
				super.setText(mRealText, mTypingBufferType);
			}
		}
		((Editable) mTypingText).append(text);
		invalidateTyping();
	}
	
	@Override
	public CharSequence getText() {
		return mTypingText;
	}
	
	public CharSequence getTypedText() {
		return super.getText();
	}
	
	public int getCharIncreaseCount() {
		return mIncreaseCount;
	}
	
	public void setCharIncreaseCount(int count) {
		if (count == 0) {
			throw new IllegalArgumentException("Increase char count can not be 0");
		}
		mIncreaseCount = count;
	}
	
	public long getTypingDelay() {
		return mTypingDelay;
	}
	
	public void setTypingDelay(long millis) {
		if (millis < 0) {
			throw new IllegalArgumentException("Typing delay must be >= 0");
		}
		mTypingDelay = millis;
	}
	
	public long getTypingStartupDelay() {
		return mStartupDelay;
	}
	
	public void setTypingStartupDelay(long millis) {
		if (millis < 0) {
			throw new IllegalArgumentException("Startup typing delay must be >= 0");
		}
		mStartupDelay = millis;
	}
	
	public int getTypingTotalCount() {
		if (mTypingText != null) {
			return mTypingText.length();
		}
		return 0;
	}
	
	public int getTypingPosition() {
		return getTypedText().length();
	}
	
	public boolean isCompletedTyping() {
		return getTypingPosition() == getTypingTotalCount();
	}
	
	public float getTypingProgress() {
		int total = getTypingTotalCount();
		if (total == 0) {
			return 1f;
		}
		return getTypingPosition() / total;
	}
	
	public void setTypingProgress(float progress) {
		if (mTypingText == null) {
			return;
		}
		if (handler != null) {
			handler.removeMessages(0x767);
		}
		if (progress < 0f) {
			progress = 0f;
		} else if (progress > 1f) {
			progress = 1f;
		}
		int index = (int) (getTypingTotalCount() * progress);
		CharSequence sub = mTypingText.subSequence(0, index);
		onIncreasedSequence(getTypedText(), sub);
		invalidateTyping();
	}
	
	@Override
	protected void onDetachedFromWindow() {
		if (handler != null) {
			handler.removeMessages(0x767);
		}
		super.onDetachedFromWindow();
	}
	
	@Override
	protected void onAttachedToWindow() {
		super.onAttachedToWindow();
		if (handler != null) {
			invalidateTyping();
			return;
		}
		handler = new Handler(Looper.getMainLooper(), new Handler.Callback() {
			
			@Override
			public boolean handleMessage(Message received) {
				synchronized (mTypingText) {
					int currentIndex = getTypingPosition();
					if (currentIndex == 0) {
						onTypingStarted(mTypingText);
					}
					int total = getTypingTotalCount();
					if (currentIndex >= total) {
						onTypingCompleted(total);
						return false;
					}
					if (increaseProgress(currentIndex)) {
						Message invalidate = Message.obtain(received);
						handler.sendMessageDelayed(invalidate, getTypingDelay());
					}
				}
				return false;
			}
		});
		invalidateTyping();
	}
}
