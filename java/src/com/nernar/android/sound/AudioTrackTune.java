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
package com.nernar.android.sound;

import android.media.*;

public class AudioTrackTune {
	
	private final int mBufferSize;
	private final AudioTrack mTrack;
	private final int mSampleRateInHz;
	
	public AudioTrackTune(int sampleRateInHz, int channelOut, int encoding, int streamType, int mode) {
		mBufferSize = AudioTrack.getMinBufferSize(sampleRateInHz,
												  channelOut, encoding);
		mTrack = new AudioTrack(streamType, sampleRateInHz,
								channelOut, encoding, mBufferSize, mode);
		mSampleRateInHz = sampleRateInHz;
	}
	
	public void write(TrackBuffer tone) {
		mTrack.write(tone.getBuffer(), 0, tone.getBufferSize());
	}
	
	public void write(short hz) {
		Tone tone = createTone();
		tone.write(hz);
		write(tone);
	}
	
	public void write(short min, short max) {
		Tone tone = createTone();
		tone.write(min, max);
		write(tone);
	}
	
	public void writeStatic(short min, short max) {
		Tone tone = createTone();
		tone.writeStatic(min, max);
		write(tone);
	}
	
	public void writeStatic(short hz, int affinity) {
		Tone tone = createTone();
		tone.writeStatic(hz, affinity);
		write(tone);
	}
	
	public void play() {
		mTrack.play();
	}
	
	public void pause() {
		mTrack.pause();
	}
	
	public void stop() {
		mTrack.stop();
	}
	
	public void release() {
		mTrack.release();
	}
	
	public int getBufferSize() {
		return mBufferSize;
	}
	
	public int getSampleRateInHz() {
		return mSampleRateInHz;
	}
	
	public AudioTrack getAudioTrack() {
		return mTrack;
	}
	
	public static class Builder {
		
		private int mOut = AudioFormat.CHANNEL_OUT_MONO;
		private int mEncoding = AudioFormat.ENCODING_PCM_16BIT;
		private int mStream = AudioManager.STREAM_MUSIC;
		private int mMode = AudioTrack.MODE_STREAM;
		private int mSampleRateInHz = 4000;
		
		public void setChannelOut(int out) {
			mOut = out;
		}
		
		public void setEncoding(int encoding) {
			mEncoding = encoding;
		}
		
		public void setStreamType(int type) {
			mStream = type;
		}
		
		public void setMode(int mode) {
			mMode = mode;
		}
		
		public void setSampleRate(int hz) {
			mSampleRateInHz = hz;
		}
		
		public AudioTrackTune create() {
			return new AudioTrackTune(mSampleRateInHz, mOut, mEncoding, mStream, mMode);
		}
	}
	
	public static interface TrackBuffer {
		
		public int getBufferSize();
		
		public short[] getBuffer();
	}
	
	public static class Tone implements TrackBuffer {
		
		public final double TWOPI = 8. * Math.atan(1.);
		private final int mSampleRateInHz;
		private final short[] mBuffer;
		
		public Tone(AudioTrackTune parent) {
			this(parent != null ? parent.getBufferSize() : 0, parent != null ? parent.getSampleRateInHz() : 0);
		}
		
		public Tone(int bufferSize, int sampleRate) {
			this(bufferSize > 0 ? new short[bufferSize] : null, sampleRate);
		}
		
		public Tone(short[] buffer, int sampleRate) {
			if (buffer == null) {
				throw new IllegalArgumentException("Buffer must be specified");
			}
			if (sampleRate <= 0) {
				throw new IllegalArgumentException("Sample rate mist be > 0");
			}
			mBuffer = buffer;
			mSampleRateInHz = sampleRate;
		}
		
		public void write(short hz) {
			synchronized (mBuffer) {
				double ph = 0.0;
				for (int i = 0; i < getBufferSize(); i++) {
					ph += TWOPI * hz / mSampleRateInHz;
					writeAt(i, (short) Math.sin(ph));
				}
			}
		}
		
		public void write(short min, short max) {
			write((short) (min + Math.random() * (max - min)));
		}
		
		public void writeStatic(short min, short max) {
			synchronized (mBuffer) {
				double ph = 0.0;
				for (int i = 0; i < getBufferSize(); i++) {
					ph += TWOPI * (min + Math.random() * (max - min)) / mSampleRateInHz;
					writeAt(i, (short) Math.sin(ph));
				}
			}
		}
		
		public void writeStatic(short hz, int affinity) {
			writeStatic((short) (hz - affinity), (short) (hz + affinity));
		}
		
		public synchronized void writeAt(int index, short hz) {
			if (index < 0 || index >= getBufferSize()) {
				throw new IndexOutOfBoundsException("Sample out of range [0.." + getBufferSize() + "]: " + index);
			}
			mBuffer[index] = (short) (10000 * hz);
		}
		
		@Override
		public int getBufferSize() {
			return mBuffer.length;
		}
		
		@Override
		public short[] getBuffer() {
			return mBuffer;
		}
	}
	
	public Tone createTone() {
		return new Tone(this);
	}
}
