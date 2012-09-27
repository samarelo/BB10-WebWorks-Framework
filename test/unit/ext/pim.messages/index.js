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
var _apiDir = __dirname + "./../../../../ext/pim.messages/",
    _libDir = __dirname + "./../../../../lib/",
    events = require(_libDir + "event"),
    index,
    mockJnextObjId = 123;

describe("pim.messages index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy("JNEXT.require").andCallFake(function () {
                return true;
            }),
            createObject: jasmine.createSpy("JNEXT.createObject").andCallFake(function () {
                return mockJnextObjId;
            }),
            invoke: jasmine.createSpy("JNEXT.invoke").andCallFake(function () {
                return '{"name":"value"}';
            }),
            registerEvents: jasmine.createSpy("JNEXT.registerEvent")
        };
        spyOn(events, "trigger");
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        index = null;
    });

    it("JNEXT require/createObject/registerEvents are called upon requiring index", function () {
        expect(JNEXT.require).toHaveBeenCalledWith("libpimmessages");
        expect(JNEXT.createObject).toHaveBeenCalledWith("libpimmessages.PimMessage");
        expect(JNEXT.registerEvents).toHaveBeenCalled();
    });

    it("findMessages", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {"name" : "%22value%22"};

        index.findMessages(successCb, failCb, args);

        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toBe('findMessages ' + '{"name":"value"}');
        expect(successCb).toHaveBeenCalledWith("");
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getAccounts", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy();

        index.getAccounts(successCb, failCb);

        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toBe('getAccounts');
        expect(successCb).toHaveBeenCalledWith(JSON.parse('{"name":"value"}'));
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getDefaultAccount", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy();

        index.getDefaultAccount(successCb, failCb);

        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toBe('getDefaultAccount');
        expect(successCb).toHaveBeenCalledWith(JSON.parse('{"name":"value"}'));
        expect(failCb).not.toHaveBeenCalled();
    });

    it("saveMessage", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {"name" : "%22value%22"};

        index.saveMessage(successCb, failCb, args);

        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toBe('saveMessage ' + '{"name":"value"}');
        expect(successCb).toHaveBeenCalledWith("");
        expect(failCb).not.toHaveBeenCalled();
    });

    it("sendMessage", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {"name" : "%22value%22"};

        index.sendMessage(successCb, failCb, args);

        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toBe('sendMessage ' + '{"name":"value"}');
        expect(successCb).toHaveBeenCalledWith("");
        expect(failCb).not.toHaveBeenCalled();
    });

    it("saveAttachment", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {"name" : "%22value%22"};

        index.saveAttachment(successCb, failCb, args);

        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toBe('saveAttachment ' + '{"name":"value"}');
        expect(successCb).toHaveBeenCalledWith("");
        expect(failCb).not.toHaveBeenCalled();
    });
});
