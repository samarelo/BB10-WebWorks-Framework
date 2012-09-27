ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

QTPLUGIN=yes

include ../../../../meta.mk
WEBWORKS_DIR=$(PROJECT_ROOT)/../../..

ifeq ($(UNITTEST),yes)
NAME=test
SRCS+=test_main.cpp
LIBS+=img
USEFILE=
endif

include $(MKFILES_ROOT)/qt-targets.mk


