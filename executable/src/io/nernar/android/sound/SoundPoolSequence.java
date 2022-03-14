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
package io.nernar.android.sound;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.media.AudioAttributes;
import android.media.SoundPool;
import java.io.FileDescriptor;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class SoundPoolSequence {
	
	private final SoundPool mPool;
	private final ArrayList<Integer> mLoaded = new ArrayList<>();
	private final ArrayList<Integer> mPlaying = new ArrayList<>();
	private final HashMap<Integer, ArrayList<Integer>> mAssociated = new HashMap<>();
	
	public SoundPoolSequence(SoundPool target) {
		if (target == null) {
			throw new NullPointerException();
		}
		mPool = target;
	}
	
	@Deprecated
	public SoundPoolSequence(int maxStreams, int streamType, int srcQuality) {
		this(new SoundPool(maxStreams, streamType, srcQuality));
	}
	
	public SoundPoolSequence(SoundPool.Builder builder) {
		this(builder.build());
	}
	
	public SoundPoolSequence(int maxStreams, AudioAttributes attrs) {
		this(new SoundPool.Builder().setMaxStreams(maxStreams).setAudioAttributes(attrs));
	}
	
	public SoundPoolSequence(int maxStreams) {
		this(new SoundPool.Builder().setMaxStreams(maxStreams));
	}
	
	public SoundPoolSequence() {
		this(new SoundPool.Builder());
	}
	
	public final SoundPool getSoundPool() {
		return mPool;
	}
	
	public void release() {
		mPool.release();
		mLoaded.clear();
		mPlaying.clear();
		mAssociated.clear();
	}
	
	public int getUid(int index) {
		if (!isLoaded(index)) {
			throw new IndexOutOfBoundsException("Sound " + index + " out of range [0.." + mLoaded.size() + "]");
		}
		return mLoaded.get(index).intValue();
	}

	public boolean isLoaded(int index) {
		return index >= 0 && index < mLoaded.size();
	}
	
	public int getCount() {
		return mLoaded.size();
	}
	
	public int load(String path, int priority) {
		int uid = mPool.load(path, priority);
		mLoaded.add(uid);
		return mLoaded.lastIndexOf(uid);
	}
	
    public int load(Context context, int resId, int priority) {
		int uid = mPool.load(context, resId, priority);
		mLoaded.add(uid);
		return mLoaded.lastIndexOf(uid);
	}
	
    public int load(AssetFileDescriptor afd, int priority) {
		int uid = mPool.load(afd, priority);
		mLoaded.add(uid);
		return mLoaded.lastIndexOf(uid);
	}
	
    public int load(FileDescriptor fd, long offset, long length, int priority) {
		int uid = mPool.load(fd, offset, length, priority);
		mLoaded.add(uid);
		return mLoaded.lastIndexOf(uid);
	}
	
    public boolean unload(int index) {
		int uid = getUid(index);
		mLoaded.remove(index);
		mAssociated.remove(Integer.valueOf(index));
		return mPool.unload(uid);
	}
	
	public boolean unloadEverything() {
		boolean yep = false;
		for (int i = 0; i < mLoaded.size(); i++) {
			if (unload(i)) yep = true;
		}
		return yep;
	}
	
    public int play(int index, float leftVolume, float rightVolume, int priority, int loop, float rate) {
		int uid = mPool.play(getUid(index), leftVolume, rightVolume, priority, loop, rate);
		mPlaying.add(uid);
		if (!mAssociated.containsKey(Integer.valueOf(index))) {
			mAssociated.put(Integer.valueOf(index), new ArrayList<Integer>());
		}
		int where = mPlaying.lastIndexOf(uid);
		mAssociated.get(Integer.valueOf(index)).add(where);
		return where;
	}
	
	public int[] playEverything(float leftVolume, float rightVolume, int priority, int loop, float rate) {
		int count = mLoaded.size();
		int[] loaded = new int[count];
		for (int i = 0; i < count; i++) {
			loaded[i] = play(i, leftVolume, rightVolume, priority, loop, rate);
		}
		return loaded;
	}
	
	public int getStreamUid(int stream) {
		if (!isActive(stream)) {
			throw new IndexOutOfBoundsException("Stream " + stream + " out of range [0.." + mPlaying.size() + "]");
		}
		return mPlaying.get(stream).intValue();
	}
	
	public boolean isActive(int stream) {
		return stream >= 0 && stream < mPlaying.size();
	}
	
	public int getStreamCount() {
		return mPlaying.size();
	}
	
	public int getStreamCountByIndex(int index) {
		return getStreamsByIndex(index).size();
	}
	
	protected ArrayList<Integer> getStreamsByIndex(int index) {
		return isAssociated(index) ? mAssociated.get(Integer.valueOf(index)) : new ArrayList<Integer>();
	}
	
	public boolean isAssociated(int index) {
		return mAssociated.containsKey(Integer.valueOf(index));
	}
	
	public int getIndexByStream(int stream) {
		for (Map.Entry<Integer, ArrayList<Integer>> associated : mAssociated.entrySet()) {
			int index = associated.getValue().indexOf(Integer.valueOf(stream));
			if (index != -1) return associated.getKey().intValue();
		}
		return -1;
	}
	
    public void pause(int stream) {
		mPool.pause(getStreamUid(stream));
	}
	
	public void pauseAll(int index) {
		ArrayList<Integer> streams = getStreamsByIndex(index);
		for (int i = 0; i < streams.size(); i++) {
			pause(streams.get(i).intValue());
		}
	}
	
	public void pauseEverything() {
		for (int i = 0; i < mPlaying.size(); i++) {
			pause(i);
		}
	}
	
    public void resume(int stream) {
		mPool.resume(getStreamUid(stream));
	}
	
	public void resumeAll(int index) {
		ArrayList<Integer> streams = getStreamsByIndex(index);
		for (int i = 0; i < streams.size(); i++) {
			resume(streams.get(i).intValue());
		}
	}
	
	public void resumeEverything() {
		for (int i = 0; i < mPlaying.size(); i++) {
			resume(i);
		}
	}
	
    public void autoPause() {
		mPool.autoPause();
	}
	
    public void autoResume() {
		mPool.autoResume();
	}
	
    public void stop(int stream) {
		int uid = getStreamUid(stream);
		mPlaying.remove(stream);
		int index = getIndexByStream(stream);
		if (mAssociated.containsKey(Integer.valueOf(index))) {
			ArrayList<Integer> streams = mAssociated.get(Integer.valueOf(index));
			streams.remove(stream);
			if (streams.size() == 0) {
				mAssociated.remove(Integer.valueOf(index));
			}
		}
		mPool.stop(uid);
	}
	
	public void stopAll(int index) {
		ArrayList<Integer> streams = getStreamsByIndex(index);
		for (Integer stream : streams) {
			stop(streams.get(0));
			stream.intValue();
		}
	}
	
	public void stopEverything() {
		for (Integer stream : mPlaying) {
			stop(0);
			stream.intValue();
		}
	}
	
    public void setVolume(int stream, float leftVolume, float rightVolume) {
		mPool.setVolume(getStreamUid(stream), leftVolume, rightVolume);
	}
	
	public void setVolumeAll(int index, float leftVolume, float rightVolume) {
		ArrayList<Integer> streams = getStreamsByIndex(index);
		for (int i = 0; i < streams.size(); i++) {
			setVolume(streams.get(i).intValue(), leftVolume, rightVolume);
		}
	}
	
	public void setVolumeEverything(float leftVolume, float rightVolume) {
		for (int i = 0; i < mPlaying.size(); i++) {
			setVolume(i, leftVolume, rightVolume);
		}
	}
	
    public void setPriority(int stream, int priority) {
		mPool.setPriority(getStreamUid(stream), priority);
	}
	
	public void setPriorityAll(int index, int priority) {
		ArrayList<Integer> streams = getStreamsByIndex(index);
		for (int i = 0; i < streams.size(); i++) {
			setPriority(streams.get(i).intValue(), priority);
		}
	}
	
	public void setPriorityEverything(int priority) {
		for (int i = 0; i < mPlaying.size(); i++) {
			setPriority(i, priority);
		}
	}
	
    public void setLoop(int stream, int loop) {
		mPool.setLoop(getStreamUid(stream), loop);
	}
	
	public void setLoopAll(int index, int lopp) {
		ArrayList<Integer> streams = getStreamsByIndex(index);
		for (int i = 0; i < streams.size(); i++) {
			setLoop(streams.get(i).intValue(), lopp);
		}
	}
	
	public void setLoopEverything(int loop) {
		for (int i = 0; i < mPlaying.size(); i++) {
			setLoop(i, loop);
		}
	}
	
    public void setRate(int stream, float rate) {
		mPool.setRate(getStreamUid(stream), rate);
	}
	
	public void setRateAll(int index, float rate) {
		ArrayList<Integer> streams = getStreamsByIndex(index);
		for (int i = 0; i < streams.size(); i++) {
			setRate(streams.get(i).intValue(), rate);
		}
	}
	
	public void setRateEverything(float rate) {
		for (int i = 0; i < mPlaying.size(); i++) {
			setRate(i, rate);
		}
	}
	
    public void setOnLoadCompleteListener(SoundPool.OnLoadCompleteListener listener) {
		mPool.setOnLoadCompleteListener(new OnLoadCompleteListener(listener));
	}
	
	private final class OnLoadCompleteListener implements SoundPool.OnLoadCompleteListener {
		
		private final SoundPool.OnLoadCompleteListener listener;
		
		public OnLoadCompleteListener(SoundPool.OnLoadCompleteListener listener) {
			this.listener = listener;
		}
		
		public void onLoadComplete(SoundPool pool, int uid, int stream) {
			if (listener != null) {
				listener.onLoadComplete(pool, mLoaded.indexOf(Integer.valueOf(uid)), mPlaying.indexOf(Integer.valueOf(stream)));
			}
		}
	}
}
