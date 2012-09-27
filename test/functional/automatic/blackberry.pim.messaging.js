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

function getAccountByName(array, name) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].name === name)
            return array[i];
    }
}

describe("blackberry.pim.messaging", function () {
    describe("get accounts", function () {
        it("gets list of synchronized accounts", function () {
            var messageAccounts = blackberry.pim.messaging.getMessageAccounts(),
                account1 = getAccountByName(messageAccounts, "WW-Yahoo1"),
                account2 = getAccountByName(messageAccounts, "WW-Yahoo2"),
                account3 = getAccountByName(messageAccounts, "WW-Yahoo3");

            expect(messageAccounts.length).toBeGreaterThan(3);
            expect(account1).toBeDefined();
            expect(account2).toBeDefined();
            expect(account3).toBeDefined();
            expect(account1.id).toBeGreaterThan(0);
            expect(account2.id).toBeGreaterThan(0);
            expect(account3.id).toBeGreaterThan(0);

        });

        it("get default message account", function () {
            var defaultAccount = blackberry.pim.messaging.getDefaultMessageAccount();

            expect(defaultAccount.name).toEqual("WW-Yahoo1");
            expect(defaultAccount.id).toBeGreaterThan(0);
        });
    });

    describe("get messages", function () {
        it("placeholder", function () {
            expect(true).toBe(true);
        });
    });

    describe("send messages", function () {
        it("placeholder", function () {
            expect(true).toBe(true);
        });
    });

    describe("save to drafts", function () {
        it("placeholder", function () {
            expect(true).toBe(true);
        });
    });

    describe("move messages between folders", function () {
        it("placeholder", function () {
            expect(true).toBe(true);
        });
    });

    describe("saving attachments", function () {
        it("placeholder", function () {
            expect(true).toBe(true);
        });
    });
});
