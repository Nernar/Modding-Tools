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

import android.graphics.RectF;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;

import io.github.rosemoe.sora.event.SelectionChangeEvent;
import io.github.rosemoe.sora.event.Unsubscribe;
import io.github.rosemoe.sora.text.Cursor;
import io.github.rosemoe.sora.widget.CodeEditor;
import io.github.rosemoe.sora.widget.EditorTouchEventHandler;

/**
 * This window will show when selecting text to present text actions.
 *
 * @author Rosemoe
 */
public class EditorTextActionWindow extends io.github.rosemoe.sora.widget.component.EditorTextActionWindow {
    private final CodeEditor mEditor;
    private final Button mPasteBtn;
    private final View mCopyBtn;
    private final View mCutBtn;
    private final EditorTouchEventHandler mHandler;
    private int mLastPosition;
    private boolean mEnabled = true;

    /**
     * Create a panel for the given editor
     *
     * @param editor Target editor
     */
    public EditorTextActionWindow(CodeEditor editor, View root, Button pasteBtn, View copyBtn, View cutBtn) {
        super(editor);
        mEditor = editor;
        mHandler = editor.getEventHandler();
        mPasteBtn = pasteBtn;
        mCopyBtn = copyBtn;
        mCutBtn = cutBtn;
        setContentView(root);
        setSize(WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT);
    }

    @Override
    public void setEnabled(boolean enabled) {
        mEnabled = enabled;
        if (!enabled) {
            dismiss();
        }
    }

    @Override
    public boolean isEnabled() {
        return mEnabled;
    }

    /**
     * Get the view root of the panel.
     *
     * Root view is {@link android.widget.LinearLayout}
     * Inside is a {@link android.widget.HorizontalScrollView}
     */
    public ViewGroup getView() {
        return (ViewGroup) getPopup().getContentView();
    }

    @Override
    public void onReceive(SelectionChangeEvent event, Unsubscribe unsubscribe) {
        if (mHandler.hasAnyHeldHandle()) {
            return;
        }
        if (event.isSelected()) {
            if (!isShowing()) {
                mEditor.post(this::displayWindow);
            }
            mLastPosition = -1;
        } else {
            boolean show = false;
            if (event.getCause() == SelectionChangeEvent.CAUSE_TAP && event.getLeft().index == mLastPosition && !isShowing() && !mEditor.getText().isInBatchEdit()) {
                mEditor.post(this::displayWindow);
                show = true;
            } else {
                dismiss();
            }
            if (event.getCause() == SelectionChangeEvent.CAUSE_TAP && !show) {
                mLastPosition = event.getLeft().index;
            } else {
                mLastPosition = -1;
            }
        }
    }

    private int selectTop(RectF rect) {
        int rowHeight = mEditor.getRowHeight();
        if (rect.top - rowHeight * 3 / 2F > getHeight()) {
            return (int) (rect.top - rowHeight * 3 / 2 - getHeight());
        } else {
            return (int) (rect.bottom + rowHeight / 2);
        }
    }

    public void displayWindow() {
        int top;
        Cursor cursor = mEditor.getCursor();
        if (cursor.isSelected()) {
            RectF leftRect = mEditor.getLeftHandleDescriptor().position;
            RectF rightRect = mEditor.getRightHandleDescriptor().position;
            int top1 = selectTop(leftRect);
            int top2 = selectTop(rightRect);
            top = Math.min(top1, top2);
        } else {
            top = selectTop(mEditor.getInsertHandleDescriptor().position);
        }
        top = Math.max(0, Math.min(top, mEditor.getHeight() - getHeight() - 5));
        float handleLeftX = mEditor.getOffset(mEditor.getCursor().getLeftLine(), mEditor.getCursor().getLeftColumn());
        float handleRightX = mEditor.getOffset(mEditor.getCursor().getRightLine(), mEditor.getCursor().getRightColumn());
        int panelX = (int) ((handleLeftX + handleRightX) / 2f);
        setLocationAbsolutely(panelX, top);
        show();
    }

    /**
     * Update the state of paste button
     */
    private void updateBtnState() {
        mPasteBtn.setEnabled(mEditor.hasClip() && mEditor.isEditable());
        mCopyBtn.setVisibility(mEditor.getCursor().isSelected() ? View.VISIBLE : View.GONE);
        mCutBtn.setVisibility(mEditor.getCursor().isSelected() && mEditor.isEditable() ? View.VISIBLE : View.GONE);
        // mRootView.measure(View.MeasureSpec.makeMeasureSpec(1000000, View.MeasureSpec.AT_MOST), View.MeasureSpec.makeMeasureSpec(100000, View.MeasureSpec.AT_MOST));
        // setSize(mRootView.getMeasuredWidth(), getHeight());
    }

    @Override
    public void show() {
        if (!mEnabled) {
            return;
        }
        updateBtnState();
        super.show();
    }

}
