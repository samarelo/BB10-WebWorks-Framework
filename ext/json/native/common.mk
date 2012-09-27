ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=json
LDFLAGS+=-Wl,-h,libjson.so

include ../../../../meta.mk

EXTRA_SRCVPATH+=$(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/src/lib_json

SRCS+=$(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/src/lib_json/json_reader.cpp \
      $(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/src/lib_json/json_value.cpp \
      $(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/src/lib_json/json_writer.cpp 

include $(MKFILES_ROOT)/qtargets.mk
