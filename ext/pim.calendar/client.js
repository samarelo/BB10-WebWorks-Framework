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

 /*
 *   blackberry.pim.Calendar
 *   Properties:
 *      
 *   Methods:
 */
var _self = {},
    _ID = require("./manifest.json").namespace,
    utils = require("./../../lib/utils");

_self.sc = function (args) {
    var obj = window.webworks.execSync(_ID, "sc", args);

    if (obj) {
        return obj;
    } else {
        return null;
    }
};

_self.asc = function (args, onSuccess, onError) {
    var callback,
        eventId;


    callback = function (rv) {
        var result;

        result = JSON.parse(rv);

        if (result._success) {
            onSuccess(result);
        } else {
            onError(result);
        }
    };

    eventId = utils.guid();

    window.webworks.event.once(_ID, eventId, callback);

    return window.webworks.execAsync(_ID, "asc", args);
};

Object.preventExtensions(_self);

module.exports = _self;
