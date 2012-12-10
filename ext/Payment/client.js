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

var _self = {},
    _ID = require("./manifest.json").namespace,
    onCreateSuccess = null,
    onCreateFail = null;

function webworksPurchaseCallback(result) {

	if (result) {	//making sure that the object is not null
		var isSuccessful = result.successState.state;

		if (onCreateSuccess) {
			if (isSuccessful === "SUCCESS")
			{
				onCreateSuccess(JSON.parse(String(result.purchasedItem)));
			} else if (isSuccessful === "FAILURE") {
				if (onCreateFail) {
					onCreateFail(JSON.parse(String(result.errorObject)));
				}
			} else if (isSuccessful === "BPS_FAILURE") {
				window.webworks.event.remove(_self._ID, "payment.purchase.callback", webworksPurchaseCallback);
				throw String(result.errorObject.errorText);
			}
		}
	} else {
		//something wrong happneed. throw to user
		throw new Error("Purchase Failed. Unexpected Error Occured.");
	}

	onCreateSuccess = null;
	onCreateFail = null;
}

_self.purchase = function (purchase_arguments_t, successCallback, failCallback) {
	
    if (!purchase_arguments_t || typeof purchase_arguments_t !== "string") {
        throw new Error("Purchase argument is not provided or is not a string.");
    }
	var args = { "digitalGoodID" : purchase_arguments_t.digitalGoodID || "",
			"digitalGoodSKU" : purchase_arguments_t.digitalGoodSKU || "",
			"digitalGoodName" : purchase_arguments_t.digitalGoodName || "",
			"metaData" : purchase_arguments_t.metaData || "",
			"purchaseAppName" : purchase_arguments_t.purchaseAppName || "",
			"purchaseAppIcon" : purchase_arguments_t.purchaseAppIcon || "",
			"extraParameters" : purchase_arguments_t.extraParameters || "" };

	onCreateSuccess = successCallback;
	onCreateFail = failCallback;
	window.webworks.event.once(_ID, "payment.purchase.callback", webworksPurchaseCallback);

	return window.webworks.execSync(_ID, "purchase", args);
};


module.exports = _self;
