/*
 * Copyright 2010-2011 Research In Motion Limited.
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

/*global internal */

function testAppValue(field, value) {
    expect(blackberry.app[field]).toBeDefined();
    expect(blackberry.app[field]).toEqual(value);
}

function testAppReadOnly(field) {
    var before = blackberry.app[field];
    blackberry.app[field] = "MODIFIED";
    expect(blackberry.app[field]).toEqual(before);
}

describe("blackberry.app", function () {
    var waitForTimeout = 2000;

    describe("orientationchange", function () {
        var onOrientationChange;

        beforeEach(function () {
            onOrientationChange = jasmine.createSpy();
            blackberry.event.addEventListener("orientationchange", onOrientationChange);
        });

        afterEach(function () {
            blackberry.event.removeEventListener("orientationchange", onOrientationChange);
            onOrientationChange = null;
        });

        it("should invoke callback with landscape-primary when user rotates the phone counter-clockwise from within application", function () {
            window.confirm("Rotate the device counter-clockwise to be in landscape mode");

            waitsFor(function () {
                return onOrientationChange.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onOrientationChange).toHaveBeenCalledWith("landscape-primary");
            });
        });

        it("should invoke callback with portrait-primary when user rotates the phone back to normal position from within application", function () {
            window.confirm("Rotate the device clockwise to return it to the original portrait position");

            waitsFor(function () {
                return onOrientationChange.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onOrientationChange).toHaveBeenCalledWith("portrait-primary");
            });
        });

        it("should invoke callback with landscape-secondary when user rotates the phone clockwise from within application", function () {
            window.confirm("Rotate the device clockwise to be in landscape mode");

            waitsFor(function () {
                return onOrientationChange.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onOrientationChange).toHaveBeenCalledWith("landscape-secondary");
            });
        });
    });

    describe("pause", function () {
        var onPause;

        beforeEach(function () {
            onPause = jasmine.createSpy();
            blackberry.event.addEventListener("pause", onPause);
        });

        afterEach(function () {
            blackberry.event.removeEventListener("pause", onPause);
            onPause = null;
        });

        it("should invoke callback when application is thumbnailed when Application Behavior is 'Paused'", function () {
            waitsFor(function () {
                return onPause.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onPause).toHaveBeenCalled();
            });

            internal.automation.swipeUp();
        });
    });

    describe("resume", function () {
        var onResume;

        beforeEach(function () {
            onResume = jasmine.createSpy();
            blackberry.event.addEventListener("resume", onResume);
        });

        afterEach(function () {
            blackberry.event.removeEventListener("resume", onResume);
            onResume = null;
        });


        it("should invoke callback when application is fullscreened when Application Behavior is 'Paused'", function () {
            waitsFor(function () {
                return onResume.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onResume).toHaveBeenCalled();
            });

            internal.automation.touch(300, 300);
        });
    });

    describe("swipedown", function () {
        var onSwipeDown;

        beforeEach(function () {
            onSwipeDown = jasmine.createSpy();
            blackberry.event.addEventListener("swipedown", onSwipeDown);
        });

        afterEach(function () {
            blackberry.event.removeEventListener("swipedown", onSwipeDown);
            onSwipeDown = null;
        });

        it("should invoke callback when user swipes down from within application", function () {

            waitsFor(function () {
                return onSwipeDown.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSwipeDown).toHaveBeenCalled();
            });

            internal.automation.swipeDown();            
        });
    });

    describe("onKeyboard Events", function () {
        var onKeyboardOpening,
            onKeyboardOpened,
            onKeyboardClosing,
            onKeyboardClosed,
            onKeyboardPosition;

        beforeEach(function () {
            onKeyboardOpening = jasmine.createSpy();
            onKeyboardOpened = jasmine.createSpy();
            onKeyboardClosing = jasmine.createSpy();
            onKeyboardClosed = jasmine.createSpy();
            onKeyboardPosition = jasmine.createSpy();
            blackberry.event.addEventListener("keyboardOpening", onKeyboardOpening);
            blackberry.event.addEventListener("keyboardOpened", onKeyboardOpened);
            blackberry.event.addEventListener("keyboardClosing", onKeyboardClosing);
            blackberry.event.addEventListener("keyboardClosed", onKeyboardClosed);
            blackberry.event.addEventListener("keyboardPosition", onKeyboardPosition);

        });

        afterEach(function () {
            blackberry.event.removeEventListener("keyboardOpening", onKeyboardOpening);
            blackberry.event.removeEventListener("keyboardOpened", onKeyboardOpened);
            blackberry.event.removeEventListener("keyboardClosing", onKeyboardClosing);
            blackberry.event.removeEventListener("keyboardClosed", onKeyboardClosed);
            blackberry.event.removeEventListener("keyboardPosition", onKeyboardPosition);
            onKeyboardOpening = null;
            onKeyboardOpened = null;
            onKeyboardClosing = null;
            onKeyboardClosed = null;
            onKeyboardPosition = null;
        });

        it("should invoke callbacks when user opens keyboard", function () {

            waitsFor(function () {
                return onKeyboardOpening.callCount && onKeyboardOpened.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onKeyboardOpening).toHaveBeenCalled();
                expect(onKeyboardOpened).toHaveBeenCalled();
                expect(onKeyboardPosition).toHaveBeenCalled();
            });

            internal.automation.showKeyboard();
            
        });

        it("should invoke callbacks when user closes keyboard", function () {

            waitsFor(function () {
                return onKeyboardClosing.callCount && onKeyboardClosed.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onKeyboardClosing).toHaveBeenCalled();
                expect(onKeyboardClosed).toHaveBeenCalled();
            });

            internal.automation.hideKeyboard();
            
        });
 
    });
});
