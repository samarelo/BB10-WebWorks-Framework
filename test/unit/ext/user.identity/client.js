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
var _extDir = __dirname + "./../../../../ext",
	_apiDir = _extDir + "/" + "user.identity",
	_ID = require(_apiDir + "/manifest").namespace,
    client,
    mockedWebworks = {
        execSync: jasmine.createSpy("webworks.execSync").andReturn(JSON.stringify({ FakeJSON : "MyFakeJSON" })),
		execAsync: jasmine.createSpy("webworks.execAsync").andReturn(JSON.stringify({ FakeJSON : "MyFakeJSON" })),
        event: {
            isOn: jasmine.createSpy("webworks.event.isOn"),
			once: jasmine.createSpy("webworks.event.once")
        }
    };
var provider = {
	"provider": jasmine.createSpy(),
	"value": "blah"
},
args = {
	"provider": provider || {}
};
	
describe("user.identity client", function () {	
    beforeEach(function () {
        GLOBAL.window = GLOBAL;
        GLOBAL.window.webworks = mockedWebworks;
        client = require(_apiDir + "/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        client = null;
    });
	
	describe("getVersion", function () {
        it("should call execSync for getVersion", function () {
            expect(client.getVersion).toBeDefined();
            client.getVersion();
            expect(window.webworks.execSync).toHaveBeenCalledWith(_ID, "getVersion", null);
        });
    });
	
	describe("setOption", function () {
		var option = 2,
			value = "Verbose",
			args = {
				"option": option,
				"value": value || {}
			};
        it("should call execSync for setOption", function () {
            expect(client.setOption).toBeDefined();
			var result = null,
				expectedResult = { SetOptionJSON : "SetOptionResult" };
			mockedWebworks.execSync = jasmine.createSpy("webworks.execSync").andReturn(JSON.stringify(expectedResult))
            result = client.setOption( option, value );
            expect(window.webworks.execSync).toHaveBeenCalledWith(_ID, "setOption", args);
			expect(result).toEqual(expectedResult);
        });
    });
	
	describe("registerProvider", function () {
		var provider = jasmine.createSpy("provider"),
			args = {
				"provider": provider || {}
			};
        it("should call execSync for registerProvider", function () {
            expect(client.registerProvider).toBeDefined();
			var result = null,
				expectedResult = { RegisterProviderJSON : "RegisterProviderResult" };
			mockedWebworks.execSync = jasmine.createSpy("webworks.execSync").andReturn(JSON.stringify(expectedResult))
            result = client.registerProvider( provider );
            expect(window.webworks.execSync).toHaveBeenCalledWith(_ID, "registerProvider", args);
			expect(result).toEqual(expectedResult);
        });
    });
	
	describe("token calls", function () {
		var successCallback = jasmine.createSpy("successCallback"),
			failureCallback = jasmine.createSpy("failureCallback"),
			idsProvider = jasmine.createSpy("idsProvider"),
			tokenType = "type",
			appliesTo = "appliesTo",
			successResult = {
				"noResult": "no"
			},
			failureResult = {
				"result": "yes"
			};
			
		describe("getToken", function () {
			var eventId = "bbidGetTokenEventId",
			args = {
				"_eventId": eventId,
				"provider": idsProvider,
				"tokenType": tokenType,
				"appliesTo": appliesTo || {}
			};
			it("should call execAsync for getToken with success callback", function () {
				expect(client.getToken).toBeDefined();
				client.getToken( idsProvider, tokenType, appliesTo, successCallback, failureCallback );
				mockedWebworks.event.once.argsForCall[0][2](JSON.stringify(successResult));
				expect(mockedWebworks.event.isOn).toHaveBeenCalledWith(eventId);
				expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, eventId, jasmine.any(Function));
				expect(successCallback).toHaveBeenCalledWith(successResult);
				expect(window.webworks.execAsync).toHaveBeenCalledWith(_ID, "getToken", args);
			});
			
			it("should call execAsync for getToken with failure callback", function () {
				expect(client.getToken).toBeDefined();
				client.getToken( idsProvider, tokenType, appliesTo, successCallback, failureCallback );
				mockedWebworks.event.once.argsForCall[1][2](JSON.stringify(failureResult));
				expect(mockedWebworks.event.isOn).toHaveBeenCalledWith(eventId);
				expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, eventId, jasmine.any(Function));
				expect(failureCallback).toHaveBeenCalledWith(failureResult);
				expect(window.webworks.execAsync).toHaveBeenCalledWith(_ID, "getToken", args);
			});
		});
		
		describe("clearToken", function () {
			var eventId = "bbidClearTokenEventId",
			args = {
				"_eventId": eventId,
				"provider": idsProvider,
				"tokenType": tokenType,
				"appliesTo": appliesTo || {}
			};
			it("should call execAsync for clearToken with success callback", function () {
				expect(client.clearToken).toBeDefined();
				client.clearToken( idsProvider, tokenType, appliesTo, successCallback, failureCallback );
				mockedWebworks.event.once.argsForCall[2][2](JSON.stringify(successResult));
				expect(mockedWebworks.event.isOn).toHaveBeenCalledWith(eventId);
				expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, eventId, jasmine.any(Function));
				expect(successCallback).toHaveBeenCalledWith(successResult);
				expect(window.webworks.execAsync).toHaveBeenCalledWith(_ID, "clearToken", args);
			});
			
			it("should call execAsync for clearToken with failure callback", function () {
				expect(client.clearToken).toBeDefined();
				client.clearToken( idsProvider, tokenType, appliesTo, successCallback, failureCallback );
				mockedWebworks.event.once.argsForCall[3][2](JSON.stringify(failureResult));
				expect(mockedWebworks.event.isOn).toHaveBeenCalledWith(eventId);
				expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, eventId, jasmine.any(Function));
				expect(failureCallback).toHaveBeenCalledWith(failureResult);
				expect(window.webworks.execAsync).toHaveBeenCalledWith(_ID, "clearToken", args);
			});
		});
	});
	
	describe("GetProperties call", function () {
		var successCallback = jasmine.createSpy("successCallback"),
			failureCallback = jasmine.createSpy("failureCallback"),
			eventId = "bbidGetPropertiesEventId",
			idsProvider = jasmine.createSpy("idsProvider"),
			userProperties = jasmine.createSpy("userProperties"),
			args = {
				"_eventId": eventId,
				"provider": idsProvider,
				"userProperties": userProperties || {}
			},
			successResult = {
				"noResult": "no",
				"userProperties": "myProps"
			},
			failureResult = {
				"result": "yes",
				"userProperties": "myProps"
			};
			
			it("should call execAsync for getProperties with success callback", function () {
				expect(client.getProperties).toBeDefined();
				client.getProperties( idsProvider, userProperties, successCallback, failureCallback );
				mockedWebworks.event.once.argsForCall[4][2](JSON.stringify(successResult));
				expect(mockedWebworks.event.isOn).toHaveBeenCalledWith(eventId);
				expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, eventId, jasmine.any(Function));
				expect(successCallback).toHaveBeenCalledWith(successResult.userProperties);
				expect(window.webworks.execAsync).toHaveBeenCalledWith(_ID, "getProperties", args);
			});
			
			it("should call execAsync for getProperties with failure callback", function () {
				expect(client.getProperties).toBeDefined();
				client.getProperties( idsProvider, userProperties, successCallback, failureCallback );
				mockedWebworks.event.once.argsForCall[5][2](JSON.stringify(failureResult));
				expect(mockedWebworks.event.isOn).toHaveBeenCalledWith(eventId);
				expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, eventId, jasmine.any(Function));
				expect(failureCallback).toHaveBeenCalledWith(failureResult);
				expect(window.webworks.execAsync).toHaveBeenCalledWith(_ID, "getProperties", args);
			});
	});
});