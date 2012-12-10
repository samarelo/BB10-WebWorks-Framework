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

#include <stdio.h>
#include <string>
#include <sstream>
#include <json/writer.h>
#include "payment_bps.hpp"
#include "payment_js.hpp"

namespace webworks {

int PaymentBPS::m_eventChannel = -1;
int PaymentBPS::m_endEventDomain = -1;

PaymentBPS::PaymentBPS(Payment *parent) : m_parent(parent)
{
    if(m_parent->callbackEventName.empty())
    {
        fprintf(stderr, "%s", "CallBack Event is not defined.\n");
    } else {
        eventNameToCallback = m_parent->callbackEventName;
    }
    bps_initialize();
}

PaymentBPS::~PaymentBPS()
{
    bps_shutdown();
}

int PaymentBPS::InitializeEvents()
{
    m_eventChannel = bps_channel_get_active();
    m_endEventDomain = bps_register_domain();

    return (m_endEventDomain >= 0) ? 0 : 1;
}

BPS_API int PaymentBPS::Purchase(purchase_arguments_t *purchase_arguments)
{
    return paymentservice_purchase_request_with_arguments(purchase_arguments);
}

int PaymentBPS::WaitForEvents()
{
    // We request PaymentService events so we can be notified when the payment service
    // responds to our requests/queries.
    int status = paymentservice_request_events(0);

    if (status == BPS_SUCCESS) {
        for (;;) {
            bps_event_t *event = NULL;
            bps_get_event(&event, -1);   // Blocking

            if (event) {
                if (bps_event_get_domain(event) == paymentservice_get_domain()) {
                    if (SUCCESS_RESPONSE == paymentservice_event_get_response_code(event)) {
                        if (PURCHASE_RESPONSE == bps_event_get_code(event)) {
                            onPurchaseSuccess(event);
                        }
                        else if (GET_EXISTING_PURCHASES_RESPONSE == bps_event_get_code(event)) {
                            //onGetExistingPurchasesSuccess(event);
                        }
                        else if (GET_PRICE_RESPONSE == bps_event_get_code(event)) {
                            //onGetExistingPurchasesSuccess(event);
                        }
                        else if (CHECK_EXISTING_RESPONSE == bps_event_get_code(event)) {
                            //onGetExistingPurchasesSuccess(event);
                        }
                        else if (CANCEL_SUBSCRIPTION_RESPONSE == bps_event_get_code(event)) {
                            //onGetExistingPurchasesSuccess(event);
                        }
                    } else {
                        onFailureCommon(event);
                    }
                }
            }
        }
    }

    return (status == BPS_SUCCESS) ? 0 : 1;
}

void PaymentBPS::onPurchaseSuccess(bps_event_t *event)
{
    if (event == NULL) {
        fprintf(stderr, "Invalid event.\n");
        return;
    }

    std::stringstream ss;
    Json::Value result;
    Json::Value successState;
    successState["state"] = "SUCCESS";
    Json::Value purchasedItem;
    Json::Value extraParameter;

    purchasedItem["purchaseID"] = Json::Value(paymentservice_event_get_purchase_id(event, 0));
    purchasedItem["transactionID"] = Json::Value(paymentservice_event_get_transaction_id(event, 0));
    purchasedItem["date"] = Json::Value(paymentservice_event_get_date(event, 0));
    purchasedItem["digitalGoodID"] = Json::Value(paymentservice_event_get_digital_good_id(event, 0));
    purchasedItem["digitalGoodSKU"] = Json::Value(paymentservice_event_get_digital_good_sku(event, 0));
    purchasedItem["licenseKey"] = Json::Value(paymentservice_event_get_license_key(event, 0));
    purchasedItem["metaData"] = Json::Value(paymentservice_event_get_metadata(event, 0));

    int extra_parameter_count = paymentservice_event_get_extra_parameter_count(event, 0);
    if (extra_parameter_count)
    {
        for (int i = 0; i < extra_parameter_count; i++)
        {
            const char* key = paymentservice_event_get_extra_parameter_key_at_index(event, i, 0);
            std::string key_Str(key);
            const char* value = paymentservice_event_get_extra_parameter_value_at_index(event, i, 0);
            extraParameter[key_Str] =Json::Value(value);
        }
    }
    purchasedItem["extraParameters"]= extraParameter;

    result["successState"] = successState;
    result["purchasedItem"] = purchasedItem;
    ss << Json::FastWriter().write(result);
    std::string result_str = ss.str();

    m_parent->NotifyEvent(eventNameToCallback, ss.str());
}

void PaymentBPS::onFailureCommon(bps_event_t *event)
{
    const int error_id = paymentservice_event_get_error_id(event);
    const char* error_text = paymentservice_event_get_error_text(event);

    std::stringstream ss;
    Json::Value result;
    Json::Value successState;
    successState["state"] = "FAILURE";
    Json::Value errorObject;
    errorObject["errorID"] = Json::Value(error_id);
    errorObject["errorText"] = Json::Value(error_text);
    result["successState"] = successState;
    result["errorObject"] = errorObject;

    ss << Json::FastWriter().write(result);
    m_parent->NotifyEvent(eventNameToCallback, ss.str());
}

// This function will be called by the primary thread
void PaymentBPS::SendEndEvent()
{
    bps_event_t *end_event = NULL;
    bps_event_create(&end_event, m_endEventDomain, 0, NULL, NULL);
    bps_channel_push_event(m_eventChannel, end_event);
}

} // namespace webworks
