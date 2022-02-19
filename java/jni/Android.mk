LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_SRC_FILES = main.cpp

LOCAL_MODULE := nteditor

include $(BUILD_SHARED_LIBRARY)
