/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var pimCalendar,
    _event = require("../../lib/event");

module.exports = {
    asc: function (success, fail, args) {
        console.log("### request asc()");
        console.log(args);
        pimCalendar.getInstance().asynchCall(args);
        success();
    },

    sc: function (success, fail, args) {
        console.log("### request sc()");
        console.log(args);
        success(pimCalendar.getInstance().syncCall(args));
    }
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.PimCalendar = function ()
{
    var self = this,
        hasInstance = false;

    self.asynchCall = function (args) {
        console.log("asynchCall");
        // JNEXT.invoke(self.m_id, "asc " + JSON.stringify(args));
        return "asynchCall";
    };

    self.syncCall = function (args) {
        console.log("synchCall");
        // var result = JNEXT.invoke(self.m_id, "sc " + JSON.stringify(args));
        var result = {result: "Fake result"};
        return result;
    };

    self.init = function () {
        console.log("### init");
        if (!JNEXT.require("libpimcalendar")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libpimcalendar.PimCalendar");

        if (self.m_id === "") {
            return false;
        }

        console.log("start registerEvents");
        JNEXT.registerEvents(self);
    };

    self.onEvent = function (strData) {
        console.log("onEvent");
        console.log(strData);
        var arData = strData.split(" "),
            strEventDesc = arData[0],
            args = {};

        if (strEventDesc === "result") {
            args.result = escape(strData.split(" ").slice(2).join(" "));
            _event.trigger(arData[1], args);
        }
    };

    self.m_id = "";

    self.getInstance = function () {
        if (!hasInstance) {
            self.init();
            hasInstance = true;
        }
        return self;
    };
};

pimCalendar = new JNEXT.PimCalendar();
