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
package com.nernar.android.widget;

import android.content.*;
import android.media.*;
import android.support.annotation.*;
import android.util.*;

public class ToneTypingTextView extends TypingTextView {
	
	private final static int INTERNAL_TONE_COUNT = 98;
	private int mDefaultTone = getRandomTone();
	private int mDefaultToneDuration = 20;
	private ToneGenerator mToneGenerator;
	private OnResolveToneObserver observer;
	
	public ToneTypingTextView(Context context) {
		super(context);
	}
	
    public ToneTypingTextView(Context context, AttributeSet attrs) {
		super(context, attrs);
	}
	
    public ToneTypingTextView(Context context, AttributeSet attrs, int defStyleAttr) {
		super(context, attrs, defStyleAttr);
	}
	
	public static abstract interface OnResolveToneObserver {
		
		public abstract boolean onResolveCharacterToneable(char sub);
		
		public abstract int onResolveCharacterTone(int base, char sub);
		
		public abstract int onResolveCharacterToneDuration(int base, char sub);
	}
	
	protected void rebuildToneGenerator() {
		if (mToneGenerator != null) {
			return;
		}
		synchronized (ToneGenerator.class) {
			try {
				mToneGenerator = new ToneGenerator(AudioManager.STREAM_MUSIC, ToneGenerator.MAX_VOLUME);
			} catch (RuntimeException e) {
				// May fail init on low memory
			}
		}
	}
	
	protected void releaseToneGenerator() {
		synchronized (ToneGenerator.class) {
			if (mToneGenerator != null) {
				mToneGenerator.release();
				mToneGenerator = null;
			}
		}
	}
	
	public final ToneGenerator getToneGenerator() {
		return mToneGenerator;
	}
	
	public final int getTypingTone() {
		return mDefaultTone;
	}
	
	public void setDefaultTone(int tone) {
		if (tone < 0 || tone > INTERNAL_TONE_COUNT) {
			throw new IndexOutOfBoundsException("Passed tone out of range [0.." + INTERNAL_TONE_COUNT + "]");
		}
		mDefaultTone = tone;
	}
	
	public final int getTypingToneDuration() {
		return mDefaultToneDuration;
	}
	
	public void setDefaultToneDuration(int duration) {
		if (duration < 0) {
			throw new IllegalArgumentException("Tone duration must be >= 0");
		}
		mDefaultToneDuration = duration;
	}
	
	public void setOnResolveToneObserver(@Nullable OnResolveToneObserver callback) {
		observer = callback;
	}
	
	public int getRandomTone() {
		return (int) (Math.random() * INTERNAL_TONE_COUNT);
	}
	
	@Override
	public void onTypingStarted(CharSequence who) {
		rebuildToneGenerator();
		super.onTypingStarted(who);
	}
	
	protected boolean onToneCharacter(char sub) {
		if (observer != null) {
			return observer.onResolveCharacterToneable(sub);
		}
		return !Character.isSpaceChar(sub);
	}
	
	protected boolean toneCharacter(char sub) {
		int tone = getTypingTone();
		int duration = getTypingToneDuration();
		if (observer != null) {
			tone = observer.onResolveCharacterTone(tone, sub);
			duration = observer.onResolveCharacterToneDuration(duration, sub);
		}
		return mToneGenerator.startTone(tone, duration);
	}
	
	protected boolean toneCharacter(@NonNull CharSequence sub) {
		if (mToneGenerator == null) {
			return false;
		}
		char toneable = 0;
		for (int i = 0; i < sub.length(); i++) {
			char current = sub.charAt(i);
			if (onToneCharacter(current)) {
				toneable = current;
				break;
			}
		}
		if (toneable == 0) {
			return false;
		}
		return toneCharacter(toneable);
	}
	
	@Override
	protected void onIncreasedSequence(CharSequence sub, CharSequence who) {
		if (sub != null) toneCharacter(sub);
		super.onIncreasedSequence(sub, who);
	}
	
	@Override
	public void onTypingCompleted(int length) {
		releaseToneGenerator();
		super.onTypingCompleted(length);
	}
}
