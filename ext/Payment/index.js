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
var paymentJNext,
    _methods = ["purchase"],
    _event = require("../../lib/event"),
    _exports = {};

module.exports = {
		purchase: function (success, fail, args) {
			var purchase_arguments_t = { "digitalGoodID" : JSON.parse(decodeURIComponent(args.digitalGoodID)),
					"digitalGoodSKU" : JSON.parse(decodeURIComponent(args.digitalGoodSKU)),
					"digitalGoodName" : JSON.parse(decodeURIComponent(args.digitalGoodName)),
					"metaData" : JSON.parse(decodeURIComponent(args.metaData)),
					"purchaseAppName" : JSON.parse(decodeURIComponent(args.purchaseAppName)),
					"purchaseAppIcon" : JSON.parse(decodeURIComponent(args.purchaseAppIcon)),
					"extraParameters" : JSON.parse(decodeURIComponent(args.extraParameters)) };		

			try {
				paymentJNext.purchase(purchase_arguments_t);
				success();
			} catch (e) {
				paymentJNext.stopEvents();                
				fail(-1, e);
			}
		}
    };

///////////////////////////////////////////////////////////////////
//JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.paymentJNext = function ()
{   
	var self = this,
	hasInstance = false;

	self.stopEvents = function () {
		JNEXT.invoke(self.m_id, "stopEvents");
	};

	self.purchase = function (args) {
		var val = JNEXT.invoke(self.m_id, "purchase " + JSON.stringify(args)), result = {}, successState = {}, errorObject = {};
		if (val === "-1") {
			//if (val === "BPS_FAILURE")
            self.stopEvents();
            successState["state"] = "BPS_FAILURE";
            errorObject["errorText"] = "Purchase Failed. Payment Service Error.";
            result.successState = {};
            result.successState = successState;
            result.errorObject = {};
            result.errorObject = errorObject;
			
			_event.trigger("payment.purchase.callback", JSON.parse(result));
		} else if (val === "0") {
			//else if (val === "BPS_SUCCESS") We can wait for the event
			//We can wait for the event
		}
	};

	self.getId = function () {
		return self.m_id;
	};

	self.init = function () {
		if (!JNEXT.require("paymentJNext")) {
			return false;
		}

		self.m_id = JNEXT.createObject("paymentJNext.Payment");

		if (!self.m_id || self.m_id === "") {
			return false;
		}

		JNEXT.registerEvents(self);
	};

	self.onEvent = function (strData) {
		var arData = strData.split(" "),
		strEventId = arData[0],
		args = arData[1],
		info = {};

		// Trigger the event handler of specific Payment events
		if (strEventId === "payment.purchase.callback") {
			self.stopEvents();
			_event.trigger("payment.purchase.callback", JSON.parse(args));
		}
	};

	self.m_id = "";

	//-----------------------------------------------------------------------------------------------
	//self.init();
	//-----------------------------------------------------------------------------------------------    
	self.getInstance = function () {
		if (!hasInstance) {
			hasInstance = true;
			self.init();
		}
		return self;
	};    
	//-----------------------------------------------------------------------------------------------    
};

paymentJNext = new JNEXT.paymentJNext();