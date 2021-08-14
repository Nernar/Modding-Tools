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
package com.nernar.android.text;

import android.graphics.*;
import android.text.style.*;
import android.view.*;

public class DraggingSpan extends ReplacementSpan {
	
	private final View mView;
	private float mShaking;
	
	public DraggingSpan(View invalidateable, float modifier) {
		if (invalidateable == null) {
			throw new NullPointerException();
		}
		mView = invalidateable;
		mShaking = modifier;
	}
	
	public DraggingSpan(View invalidateable) {
		this(invalidateable, 3.f);
	}
	
	public void setModifier(float modifier) {
		mShaking = modifier;
	}
	
	public float getModifier() {
		return mShaking;
	}
	
	@Override
	public int getSize(Paint paint, CharSequence text, int start, int end, Paint.FontMetricsInt metrics) {
		return (int) paint.measureText(text, start, end);
	}
	
	@Override
	public void draw(Canvas canvas, CharSequence text, int start, int end, float x, int top, int y, int bottom, Paint paint) {
		for (int i = start; i < end; i++) {
			float dx = (float) (Math.random() * mShaking) - (mShaking / 2);
			float dy = (float) (Math.random() * mShaking) - (mShaking / 2);
			canvas.drawText(text, i, i + 1, x + dx, y + dy, paint);
			x += paint.measureText(text, i, i + 1);
		}
		mView.invalidate();
	}
}
