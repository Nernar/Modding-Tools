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
package io.nernar.android.widget;

import android.content.Context;
import android.media.SoundPool;
import android.support.annotation.NonNull;
import android.util.AttributeSet;
import io.nernar.android.sound.SoundPoolSequence;

public class SoundTypingTextView extends TypingTextView {
	private Sound mDefaultSound = new Sound(0, 1.f, 1.f, 1, 0, 1.f);
	private SoundPoolSequence mSoundSequence;
	private OnResolveSoundObserver observer;
	private boolean mStopWhenDetach = true;

	public SoundTypingTextView(Context context) {
		super(context);
	}

	public SoundTypingTextView(Context context, SoundPool pool) {
		this(context, new SoundPoolSequence(pool));
	}

	public SoundTypingTextView(Context context, SoundPoolSequence sequence) {
		this(context);
		attachPool(sequence);
	}

	public SoundTypingTextView(Context context, AttributeSet attrs) {
		super(context, attrs);
	}

	public SoundTypingTextView(Context context, AttributeSet attrs, SoundPool pool) {
		this(context, attrs, new SoundPoolSequence(pool));
	}

	public SoundTypingTextView(Context context, AttributeSet attrs, SoundPoolSequence sequence) {
		this(context, attrs);
		attachPool(sequence);
	}

	public SoundTypingTextView(Context context, AttributeSet attrs, int defStyleAttr) {
		super(context, attrs, defStyleAttr);
	}

	public SoundTypingTextView(Context context, AttributeSet attrs, int defStyleAttr, SoundPool pool) {
		this(context, attrs, defStyleAttr, new SoundPoolSequence(pool));
	}

	public SoundTypingTextView(Context context, AttributeSet attrs, int defStyleAttr, SoundPoolSequence sequence) {
		this(context, attrs, defStyleAttr);
		attachPool(sequence);
	}

	public class Sound {
		public final int sound;
		public final float leftVolume;
		public final float rightVolume;
		public final int priority;
		public final int loop;
		public final float rate;

		public Sound(int sound, float leftVolume, float rightVolume, int priority, int loop, float rate) {
			if (sound < -1) {
				throw new IndexOutOfBoundsException("Sound must be >= -1");
			}
			if (loop < -1) {
				throw new IndexOutOfBoundsException("Loop must be >= -1");
			}
			this.sound = sound;
			if (leftVolume < 0) leftVolume = 0f;
			else if (leftVolume > 1) leftVolume = 1f;
			if (rightVolume < 0) rightVolume = 0f;
			else if (rightVolume > 1) rightVolume = 1f;
			this.leftVolume = leftVolume;
			this.rightVolume = rightVolume;
			this.priority = priority;
			this.loop = loop;
			if (rate < 0) rate = 0f;
			else if (rate > 2) rate = 2f;
			this.rate = rate;
		}

		public Sound(int sound, float volume, int priority, int loop, float rate) {
			this(sound, volume, volume, priority, loop, rate);
		}

		public Sound(int sound, float volume, int priority, int loop) {
			this(sound, volume, priority, loop, mDefaultSound.rate);
		}

		public Sound(int sound, float volume, int priority) {
			this(sound, volume, priority, mDefaultSound.loop);
		}

		public Sound(int sound, float volume) {
			this(sound, volume, mDefaultSound.priority);
		}

		public Sound(int sound) {
			this(sound, mDefaultSound.leftVolume, mDefaultSound.rightVolume, mDefaultSound.priority, mDefaultSound.loop, mDefaultSound.rate);
		}

		public Sound() {
			this(mDefaultSound.sound);
		}

		public Sound(Sound base) {
			this(base.sound, base.leftVolume, base.rightVolume, base.priority, base.loop, base.rate);
		}

		@Override
		public boolean equals(Object obj) {
			if (obj instanceof Sound) {
				return ((Sound) obj).sound == sound;
			}
			return super.equals(obj);
		}
	}

	public static abstract interface OnResolveSoundObserver {
		public abstract boolean onResolveCharacterSoundable(char sub);
		public abstract Sound onResolveCharacterSound(Sound base, char sub);
	}

	public void attachPool(SoundPool pool) {
		attachPool(new SoundPoolSequence(pool));
	}

	public void attachPool(SoundPoolSequence sequence) {
		stopTypingSound();
		mSoundSequence = sequence;
	}

	public void setStopWhenDetach(boolean enabled) {
		mStopWhenDetach = enabled;
	}

	public boolean isStoppingWhenDetach() {
		return mStopWhenDetach;
	}

	protected void stopTypingSound() {
		if (mSoundSequence == null) {
			return;
		}
		if (mDefaultSound.sound == -1) {
			mSoundSequence.stopEverything();
			return;
		}
		mSoundSequence.stopAll(mDefaultSound.sound);
	}

	public void setDefaultSound(int sound) {
		mDefaultSound = new Sound(sound);
	}

	public int getDefaultSound() {
		return mDefaultSound.sound;
	}

	public void resetDefaultSound() {
		setDefaultSound(-1);
	}

	public void setDefaultVolume(float leftVolume, float rightVolume) {
		mDefaultSound = new Sound(mDefaultSound.sound, leftVolume, rightVolume, mDefaultSound.priority, mDefaultSound.loop, mDefaultSound.rate);
	}

	public void setDefaultVolume(float volume) {
		setDefaultVolume(volume, volume);
	}

	public float getDefaultLeftVolume() {
		return mDefaultSound.leftVolume;
	}

	public float getDefaultRightVolume() {
		return mDefaultSound.rightVolume;
	}

	public void setDefaultPriority(int priority) {
		mDefaultSound = new Sound(mDefaultSound.sound, mDefaultSound.leftVolume, mDefaultSound.rightVolume, priority, mDefaultSound.loop, mDefaultSound.rate);
	}

	public int getDefaultPriority() {
		return mDefaultSound.priority;
	}

	public void setDefaultLoop(int loop) {
		mDefaultSound = new Sound(mDefaultSound.sound, mDefaultSound.leftVolume, mDefaultSound.rightVolume, mDefaultSound.priority, loop, mDefaultSound.rate);
	}

	public int getDefaultLoop() {
		return mDefaultSound.loop;
	}

	public void setDefaultRate(float rate) {
		mDefaultSound = new Sound(mDefaultSound.sound, mDefaultSound.leftVolume, mDefaultSound.rightVolume, mDefaultSound.priority, mDefaultSound.loop, rate);
	}

	public float getDefaultRate() {
		return mDefaultSound.rate;
	}

	public Sound getTypingSound() {
		return new Sound();
	}

	protected boolean onSoundCharacter(char sub) {
		if (observer != null) {
			return observer.onResolveCharacterSoundable(sub);
		}
		return !Character.isSpaceChar(sub);
	}

	protected int soundCharacter(char sub) {
		Sound sound = getTypingSound();
		if (observer != null) {
			sound = observer.onResolveCharacterSound(sound, sub);
		}
		return mSoundSequence.play(sound.sound, sound.leftVolume, sound.rightVolume, sound.priority, sound.loop, sound.rate);
	}

	protected int soundCharacter(@NonNull CharSequence sub) {
		if (mSoundSequence == null) {
			return -1;
		}
		char soundable = 0;
		for (int i = 0; i < sub.length(); i++) {
			char current = sub.charAt(i);
			if (onSoundCharacter(current)) {
				soundable = current;
				break;
			}
		}
		if (soundable == 0) {
			return -1;
		}
		return soundCharacter(soundable);
	}

	@Override
	protected void onIncreasedSequence(CharSequence sub, CharSequence who) {
		if (sub != null) soundCharacter(sub);
		super.onIncreasedSequence(sub, who);
	}

	@Override
	protected void onDetachedFromWindow() {
		if (mStopWhenDetach) stopTypingSound();
		super.onDetachedFromWindow();
	}
}
