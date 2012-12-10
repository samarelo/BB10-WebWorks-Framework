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

#ifndef PAYMENT_JS_H_
#define PAYMENT_JS_H_

#include <pthread.h>
#include <plugin.h>
#include <sstream>
#include <string>

void* PaymentEventThread(void *args);

class Payment : public JSExt
{
public:
    explicit Payment(const std::string& id);
    virtual ~Payment();
    virtual std::string InvokeMethod(const std::string& command);
    virtual bool CanDelete();
    std::string callbackEventName;
    void NotifyEvent(const std::string& eventId, const std::string& eventArgs);
    void StartEvents();
    void StopEvents();
private:
    std::string m_id;
    pthread_t m_thread;
};

#endif /* PAYMENT_JS_H_ */
