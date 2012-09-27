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
var _ID = require("./manifest.json").namespace,
    _utils = require("./../../lib/utils"),
    Message,
    MessageStatus,
    PriorityType,
    MessageFolder = require("./MessageFolder"),
    MessageAccount = require("./MessageAccount"),
    MessageAddress = require("./MessageAddress"),
    MessageAttachment = require("./MessageAttachment"),
    MessageError = require("./MessageError");

function setCallbackForOnce(eventId, onSuccess, onError) {
    var callback = function (args) {
        var result = JSON.parse(unescape(args.result));

        if (result._success) {
            if (onSuccess && typeof onSuccess === "function") {
                onSuccess();
            }
        } else {
            if (onError && typeof onError === "function") {
                onError(new MessageError(result.errorCode));
            }
        }
    };

    if (!window.webworks.event.isOn(eventId)) {
        window.webworks.event.once(_ID, eventId, callback);
    }
}

Message = function (args) {
    args = args || {};
    Object.defineProperty(this, "id", { "value": args.id || "" });
    Object.defineProperty(this, "hash", { "value": args.hash || ""});
    Object.defineProperty(this, "devicetimestamp", { "value": args.devicetimestamp || ""});
    this.account = args.account || null;
    this.folder = args.folder || "";
    this.priority = args.priority || PriorityType.Normal;
    this.flagged = args.flagged || false;
    this.status = args.status || MessageStatus["new"];
    this.read = args.read || false;
    this.addresses = args.addresses ? MessageAddress.getArrayOfObjectsFromArrayOfJSONs(args.addresses) : [];
    this.attachments = args.attachments ? MessageAttachment.getArrayOfObjectsFromArrayOfJSONs(args.attachments) : [];
    this.bodyType = args.bodyType || "";
    this.subject = args.subject || "";
    this.body = args.body || "";

};

Message.prototype.getJSON = function () {
    return {
        'id': this.id,
        'hash': this.hash,
        'devicetimestamp': this.devicetimestamp,
        'account': this.account.getJSON(),
        'folder': this.folder,
        'priority': this.priority,
        'flagged': this.flagged,
        'status': this.status,
        'read': this.read,
        'addresses': MessageAddress.getArrayOfJSONsFromArrayOfObjects(this.addresses),
        'attachments': MessageAttachment.getArrayOfJSONsFromArrayOfObjects(this.attachments),
        'bodyType': this.bodyType,
        'subject': this.subject,
        'body': this.body
    };
};

Message.prototype.save = function (onSuccess, onError) {
    var request = this.getJSON();

    if ((onSuccess && typeof onSuccess === "function") || (onError && typeof onError === "function")) {
        request._eventId = _utils.guid();
        setCallbackForOnce(request._eventId, onSuccess, onError);
    }

    window.webworks.execAsync(_ID, "saveMessage", request);
};

Message.prototype.send = function (onSuccess, onError) {
    var request = this.getJSON();

    if ((onSuccess && typeof onSuccess === "function") || (onError && typeof onError === "function")) {
        request._eventId = _utils.guid();
        setCallbackForOnce(request._eventId, onSuccess, onError);
    }

    window.webworks.execAsync(_ID, "sendMessage", request);
};


Message.prototype.addAttachment = function (name, mimeType, filePath) {
    var props = {
        'id': "",
        'messageId': this.id,
        'accountId': this.account.id,
        'name': name,
        'mimeType': mimeType,
        'filePath': filePath
    };

    this.attachments.push(new MessageAttachment(props));
};

Message.prototype.removeAttachment = function (index) {
    if (index && typeof index === "number" && index >= 0 && index < this.attachments.length) {
        this.attachments.splice(index, 1);
    }
};

MessageStatus = function () {
};
Object.defineProperty(MessageStatus, "read", {"value": 0});
Object.defineProperty(MessageStatus, "draft", {"value": 1});
Object.defineProperty(MessageStatus, "field", {"value": 2});
Object.defineProperty(MessageStatus, "sent", {"value": 3});
Object.defineProperty(MessageStatus, "deffered", {"value": 4});
Object.defineProperty(MessageStatus, "broadcast", {"value": 5});
Object.defineProperty(MessageStatus, "new", {"value": 6});

PriorityType = function () {
};
Object.defineProperty(PriorityType, "Low", {"value": 0});
Object.defineProperty(PriorityType, "Normal", {"value": 1});
Object.defineProperty(PriorityType, "Hight", {"value": 2});

Message.MessageStatus = MessageStatus;
Message.PriorityType = PriorityType;

module.exports = Message;
