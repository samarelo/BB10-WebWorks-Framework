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
var _apiDir = __dirname + "./../../../../ext/user.identity/",
    _libDir = __dirname + "./../../../../lib/",
    events = require(_libDir + "event"),
    eventExt = require(__dirname + "./../../../../ext/event/index"),
    index = null;
	
describe("user.identity.index", function () {
	var successCallback = jasmine.createSpy("successCallback");
	
    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy().andReturn(true),
            createObject: jasmine.createSpy().andReturn("1"),
            invoke: jasmine.createSpy().andReturn(2),
            registerEvents: jasmine.createSpy().andReturn(true),
            getgid: jasmine.createSpy().andReturn(jasmine.any(String)) 
        };
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        index = null;
    });
	
	it("getVersion", function () {
		index.getVersion(successCallback, null, null, null);

		expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "getVersion");
		expect(successCallback).toHaveBeenCalled();
	});
	
	describe("setOption", function () {
		it("With string option", function () {
			var argsWithString = {
					option: "\"2\"",
					value: "\"myValue\"" || {}
				},
				result = {
					option: 2,
					value: "myValue" || {}
				};
				
			expect(index.setOption).toBeDefined();
			index.setOption(successCallback, null, argsWithString, null);
			expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "setOption " + JSON.stringify(result));
			expect(successCallback).toHaveBeenCalled();
		});
		it("With int option", function () {
			var argsWithInt = {
					option: 2,
					value: "\"myValue\"" || {}
				},
				result = {
					option: 2,
					value: "myValue" || {}
				};
				
			index.setOption(successCallback, null, argsWithInt, null);
			expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "setOption " + JSON.stringify(result));
			expect(successCallback).toHaveBeenCalled();
		});
		it("With object value", function () {
			var argsWithObject = {
					option: 2,
					value: "[{\"valueSub\": \"myValue\"}]"
				},
				result = {
					option: 2,
					value: ""
				};
				
			index.setOption(successCallback, null, argsWithObject, null);
			expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "setOption " + JSON.stringify(result));
			expect(successCallback).toHaveBeenCalled();
		});
	});
	
	it("getToken", function () {
		var args = {
				_eventId: "\"myEventId\"",
				provider: "\"myProvider\"",
				tokenType: "\"myTokenType\"",
				appliesTo: "\"myAppliesTo\"" || {}
			},
			result = {
				_eventId: "myEventId",
				provider: "myProvider",
				tokenType: "myTokenType",
				appliesTo: "myAppliesTo" || {}
			};
			
		expect(index.getToken).toBeDefined();
		index.getToken(successCallback, null, args, null);
		expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "getToken " + JSON.stringify(result));
		expect(successCallback).toHaveBeenCalled();
	});
	
	it("clearToken", function () {
		var args = {
				_eventId: "\"myEventId\"",
				provider: "\"myProvider\"",
				tokenType: "\"myTokenType\"",
				appliesTo: "\"myAppliesTo\"" || {}
			},
			result = {
				_eventId: "myEventId",
				provider: "myProvider",
				tokenType: "myTokenType",
				appliesTo: "myAppliesTo" || {}
			}
			
		expect(index.clearToken).toBeDefined();
		index.clearToken(successCallback, null, args, null);
		expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "clearToken " + JSON.stringify(result));
		expect(successCallback).toHaveBeenCalled();
	});
	
	describe("getProperties", function () {
		it("single property", function () {
			var args = {
					_eventId: "\"myEventId\"",
					provider: "\"myProvider\"",
					numProps: 0,
					userProperties: "\"prop1\"" || {}
				},
				result = {
					_eventId: "myEventId",
					provider: "myProvider",
					numProps: 1,
					userProperties: "prop1" || {}
				}
				
			expect(index.getProperties).toBeDefined();
			index.getProperties(successCallback, null, args, null);
			expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "getProperties " + JSON.stringify(result));
			expect(successCallback).toHaveBeenCalled();
		});
		it("multiple properties property", function () {
			var args = {
					_eventId: "\"myEventId\"",
					provider: "\"myProvider\"",
					numProps: 0,
					userProperties: "\"prop1,prop2,prop3\"" || {}
				},
				result = {
					_eventId: "myEventId",
					provider: "myProvider",
					numProps: 3,
					userProperties: "prop1,prop2,prop3" || {}
				}
				
			index.getProperties(successCallback, null, args, null);
			expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "getProperties " + JSON.stringify(result));
			expect(successCallback).toHaveBeenCalled();
		});
	});
});