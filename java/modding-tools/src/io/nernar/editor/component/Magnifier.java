/*
 *    sora-editor - the awesome code editor for Android
 *    https://github.com/Rosemoe/sora-editor
 *    Copyright (C) 2020-2022  Rosemoe
 *
 *     This library is free software; you can redistribute it and/or
 *     modify it under the terms of the GNU Lesser General Public
 *     License as published by the Free Software Foundation; either
 *     version 2.1 of the License, or (at your option) any later version.
 *
 *     This library is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *     Lesser General Public License for more details.
 *
 *     You should have received a copy of the GNU Lesser General Public
 *     License along with this library; if not, write to the Free Software
 *     Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
 *     USA
 *
 *     Please contact Rosemoe by email 2073412493@qq.com if you need
 *     additional information or have any questions
 */
package io.nernar.editor.component;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.os.Build;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.PixelCopy;
import android.view.View;
import android.widget.ImageView;
import android.widget.PopupWindow;

import android.support.annotation.RequiresApi;

import io.github.rosemoe.sora.widget.CodeEditor;
import io.github.rosemoe.sora.widget.EditorPainter;

/**
 * Magnifier specially designed for CodeEditor
 *
 * @author Rosemoe
 */
public class Magnifier extends io.github.rosemoe.sora.widget.component.Magnifier {

    private final CodeEditor view;
    private final PopupWindow popup;
    private final ImageView image;
    private final Paint paint;
    private View mParentView;
    private int x, y;
    private final float maxTextSize;
    private long expectedRequestTime;
    private boolean enabled = true;
    private boolean withinEditorForcibly = false;

    /**
     * Scale factor for regions
     */
    private final float scaleFactor;

    public Magnifier(CodeEditor editor, View content, ImageView magnifier) {
        super(editor);
		view = editor;
        popup = new PopupWindow(editor);
        popup.setElevation(view.getDpUnit() * 8);
        image = magnifier;
        mParentView = editor;
        popup.setHeight((int) (editor.getDpUnit() * 70));
        popup.setWidth((int) (editor.getDpUnit() * 100));
        popup.setContentView(content);
        maxTextSize = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, 28, view.getResources().getDisplayMetrics());
        scaleFactor = 1.35f;
        paint = new Paint();
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
        if (!enabled) {
            dismiss();
        }
    }

    /***
     * @see #setWithinEditorForcibly(boolean)
     */
    public boolean isWithinEditorForcibly() {
        return withinEditorForcibly;
    }

    /**
     * If true, the magnifier will never try to copy pixels by system and create the image by
     * editor.
     * If you are trying to add the view into an activity by WindowManager, this should be enabled.
     * Otherwise, the generated image may be wrong.
     */
    public void setWithinEditorForcibly(boolean withinEditorForcibly) {
        this.withinEditorForcibly = withinEditorForcibly;
    }

    /**
     * Show the magnifier according to the given position.
     * X and Y are relative to the code editor view
     */
    public void show(int x, int y) {
        if (!enabled) {
            return;
        }
        if (Math.abs(x - this.x) < 2 && Math.abs(y - this.y) < 2) {
            return;
        }
        if (view.getTextSizePx() > maxTextSize) {
            if (isShowing()) {
                dismiss();
            }
            return;
        }
        popup.setWidth(Math.min(view.getWidth() * 3 / 5, (int)view.getDpUnit()) * 250);
        this.x = x;
        this.y = y;
        int left = Math.max(x - popup.getWidth() / 2, 0);
        int right = left + popup.getWidth();
        if (right > view.getWidth()) {
            right = view.getWidth();
            left = Math.max(0, right - popup.getWidth());
        }
        int top = Math.max(y - popup.getHeight() - (int) (view.getRowHeight()), 0);
        if (popup.isShowing()) {
            popup.update(left, top, popup.getWidth(), popup.getHeight());
        } else {
            popup.showAtLocation(mParentView, left, top, Gravity.START | Gravity.TOP);
        }
        updateDisplay();
    }

    /**
     * Whether the magnifier is showing
     */
    public boolean isShowing() {
        return popup.isShowing();
    }

    /**
     * Hide the magnifier
     */
    public void dismiss() {
        popup.dismiss();
    }

    /**
     * Update the display of the magnifier without updating the window's
     * location on screen.
     *
     * This should be called when new content has been drawn on the target view so
     * that the content in magnifier will not be invalid.
     *
     * This method does not take effect if the magnifier is not currently shown
     */
    public void updateDisplay() {
        if (!isShowing()) {
            return;
        }
        if (!withinEditorForcibly && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && view.getContext() instanceof Activity) {
            updateDisplayOreo((Activity)view.getContext());
        } else {
            updateDisplayWithinEditor();
        }
    }

    /**
     * Update display on API 26 or later.
     *
     * This will include other view in the window as {@link PixelCopy} is used to capture the
     * screen.
     */
    @RequiresApi(api = Build.VERSION_CODES.O)
    private void updateDisplayOreo(Activity activity) {
        int requiredWidth = (int) (popup.getWidth() / scaleFactor);
        int requiredHeight = (int) (popup.getHeight() / scaleFactor);

        int left = Math.max(x - requiredWidth / 2, 0);
        int top = Math.max(y - requiredHeight / 2, 0);
        int right = Math.min(left + requiredWidth, view.getWidth());
        int bottom = Math.min(top + requiredHeight, view.getHeight());
        if (right - left < requiredWidth) {
            left = Math.max(0, right - requiredWidth);
        }
        if (bottom - top < requiredHeight) {
            top = Math.max(0, bottom - requiredHeight);
        }
        if (right - left <= 0 || bottom - top <= 0) {
            dismiss();
            return;
        }
        int[] pos = new int[2];
        view.getLocationInWindow(pos);
        final long requestTime = System.currentTimeMillis();
        expectedRequestTime = requestTime;
        Bitmap clip = Bitmap.createBitmap(right - left, bottom - top, Bitmap.Config.ARGB_8888);
        try {
            PixelCopy.request(activity.getWindow(), new Rect(pos[0] + left, pos[1] + top, pos[0] + right, pos[1] + bottom), clip, (int statusCode) -> {
                if (requestTime != expectedRequestTime) {
                    return;
                }
                if (statusCode == PixelCopy.SUCCESS) {
                    Bitmap dest = Bitmap.createBitmap(popup.getWidth(), popup.getHeight(), Bitmap.Config.ARGB_8888);
                    Bitmap scaled = Bitmap.createScaledBitmap(clip, popup.getWidth(), popup.getHeight(), false);
                    clip.recycle();

                    Canvas canvas = new Canvas(dest);
                    paint.reset();
                    paint.setAntiAlias(true);
                    canvas.drawARGB(0, 0, 0, 0);
                    final int roundFactor = 6;
                    canvas.drawRoundRect(0, 0, popup.getWidth(), popup.getHeight(), view.getDpUnit() * roundFactor, view.getDpUnit() * roundFactor, paint);
                    paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
                    canvas.drawBitmap(scaled, 0, 0, paint);
                    scaled.recycle();

                    image.setImageBitmap(dest);
                } else {
                    Log.w("Magnifier", "Failed to copy pixels, error = " + statusCode);
                }
            }, view.getHandler());
        } catch (IllegalArgumentException e) {
            // Happens when the view has not been drawn yet
            dismiss();
            if (!clip.isRecycled()) {
                clip.recycle();
            }
        }
    }

    /**
     * Update display on low API devices
     *
     * This method does not include other views as it obtain editor's display by
     * directly calling {@link EditorPainter#drawView(Canvas)}
     */
    private void updateDisplayWithinEditor() {
        Bitmap dest = Bitmap.createBitmap(popup.getWidth(), popup.getHeight(), Bitmap.Config.ARGB_8888);
        int requiredWidth = (int) (popup.getWidth() / scaleFactor);
        int requiredHeight = (int) (popup.getHeight() / scaleFactor);

        int left = Math.max(x - requiredWidth / 2, 0);
        int top = Math.max(y - requiredHeight / 2, 0);
        int right = Math.min(left + requiredWidth, view.getWidth());
        int bottom = Math.min(top + requiredHeight, view.getHeight());
        if (right - left < requiredWidth) {
            left = Math.max(0, right - requiredWidth);
        }
        if (bottom - top < requiredHeight) {
            top = Math.max(0, bottom - requiredHeight);
        }
        if (right - left <= 0 || bottom - top <= 0) {
            dismiss();
            dest.recycle();
            return;
        }
        Bitmap clip = Bitmap.createBitmap(requiredWidth, requiredHeight, Bitmap.Config.ARGB_8888);
        Canvas viewCanvas = new Canvas(clip);
        viewCanvas.translate(-left, -top);
        view.draw(viewCanvas);
        Bitmap scaled = Bitmap.createScaledBitmap(clip, popup.getWidth(), popup.getHeight(), false);
        clip.recycle();

        Canvas canvas = new Canvas(dest);
        paint.reset();
        paint.setAntiAlias(true);
        canvas.drawARGB(0, 0, 0, 0);
        final int roundFactor = 6;
        canvas.drawRoundRect(0, 0, popup.getWidth(), popup.getHeight(), view.getDpUnit() * roundFactor, view.getDpUnit() * roundFactor, paint);
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        canvas.drawBitmap(scaled, 0, 0, paint);
        scaled.recycle();

        image.setImageBitmap(dest);
    }

    /**
     * Set parent view of popup.
     * @param view View for {@link PopupWindow#showAtLocation(View, int, int, int)}
     */
    public void setParentView(View view) {
        mParentView = view;
    }

    public View getParentView() {
        return mParentView;
    }
}
