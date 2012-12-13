/*
 *  Copyright 2012 Research In Motion Limited.
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
module.exports = function (done, custom) {
    var sys = require('sys'),
        path = require('path'),
        TEST_APP_PATH = path.normalize(__dirname + "/../test/test-app/"),
        TEST_SUITE_PATH = path.normalize(__dirname + "/../test/test-suite/"),
        TEST_SUITE_APPS_PATH = path.join(TEST_SUITE_PATH, "Apps"),
        TEST_SUITE_OUTPUT_PATH = path.join(TEST_SUITE_PATH, "data", "output"),
        utils = require('./build/utils'),
        CLITest = require(TEST_SUITE_PATH + '/test/CLITest'),
        DeployTest = require(TEST_SUITE_PATH + '/test/DeployTest'),
        reporter = require(TEST_SUITE_PATH + 'test/reporter'),
        settings = require(__dirname + '/../test-runner.json'),
        wrench = require("wrench"),
        queue,
        finalResults = {
            suites: {
                length: 0
            },
            results: {
                totalCount: 0,
                passedCount: 0,
                failedCount: 0,
                skipped: false,
                items_: []
            }
        },
        key;

    queue = [
        {
            name: "Disable Web Security Tests",
            input: TEST_SUITE_APPS_PATH + "/DisableWebSecurity/",
            output: TEST_SUITE_OUTPUT_PATH + "/device/DisableWebSecurity.bar"
        }, {
            name: "Subfolder Content Page Tests",
            input: TEST_SUITE_APPS_PATH + "/SubfolderStartupPage/",
            output: TEST_SUITE_OUTPUT_PATH + "/device/SubfolderStartupPage.bar"
        }, {
            name: "Wildcard (*) Access Tests",
            input: TEST_SUITE_APPS_PATH + "/WildcardDomain/",
            output: TEST_SUITE_OUTPUT_PATH + "/device/WildcardDomain.bar"
        }, {
            name: "WebWorks Test App",
            input: TEST_SUITE_APPS_PATH + "/wwTest/",
            output: TEST_SUITE_OUTPUT_PATH + "/device/wwTest.bar"
        }
    ];

    //Prepare WebWorks Test App
    utils.copyFile(path.join(TEST_APP_PATH, "config.xml"), path.join(TEST_SUITE_APPS_PATH, "wwTest"));
    wrench.rmdirSyncRecursive(path.join(TEST_SUITE_APPS_PATH, "wwTest", "spec"), true);
    wrench.copyDirSyncRecursive(path.join(__dirname,"..", "test", "functional", "automatic"), path.join(TEST_SUITE_APPS_PATH,"wwTest", "spec"));


    function processItem (queueItem, done) {

        wrench.rmdirSyncRecursive(TEST_SUITE_OUTPUT_PATH, true);
        wrench.mkdirSyncRecursive(TEST_SUITE_OUTPUT_PATH, "0755");

        var cliTest2;
        cliTest2 = new CLITest(settings.packager);
        cliTest2.addOption(queueItem.input);
        cliTest2.addOption("-d");
        cliTest2.addOption("-o", TEST_SUITE_OUTPUT_PATH);
        cliTest2.run(function () {
            var reqData = [],
                flag = false,
                dt,
                start;

            try {

                dt = new DeployTest(queueItem.output);
                dt.listen(function (request) {
                    //console.log(">>>>>>>> Data Received", request);
                    if (request.status === 'finished') {
                        //Update finalResults
                        finalResults.suites.length += request.data.suites.length;
                        finalResults.results.totalCount += request.data.results.totalCount;
                        finalResults.results.passedCount += request.data.results.passedCount;
                        finalResults.results.failedCount += request.data.results.failedCount;
                        finalResults.results.items_.push(request.data.results.items_);
                        //Print Whitespace
                        sys.print('\n');
                        sys.print("FINISHED " + queueItem.name);
                        sys.print('\n');
                        sys.print('\n');

                        dt.terminate(function () {
                            done();
                        });
                    } else if (request.status === "SuiteResults") {
                        hackSummaryReporter.reportSuiteResults(request.data);
                    } else if (request.status === "SpecResults") {
                        hackSummaryReporter.reportSpecResults(request.data);
                    } else if (request.status === "RunnerStarting") {
                        sys.print("STARTING " + queueItem.name);
                        sys.print('\n');
                    }
                });
                dt.startServer();
                dt.deploy();
            } catch(e) {
                dt.terminate(function () {
                    throw e;
                });
            }
        });
    }

    var hackSummaryReporter = new reporter.TerminalReporter();

    function processQueue() {
        var queueItem;
        if (queue.length) {
            queueItem = queue.shift();
            processItem(queueItem, processQueue);
        } else {
            hackSummaryReporter.reportRunnerResults(finalResults);
            sys.print("TEST SUITE COMPLETED");
            sys.print('\n');
        }
    }

    sys.print("STARTING TEST SUITE");
    sys.print('\n');
    processQueue();
};
