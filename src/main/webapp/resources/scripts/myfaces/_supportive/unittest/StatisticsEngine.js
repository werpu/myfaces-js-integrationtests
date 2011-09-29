/* Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * A simple statistics engine which keeps track of the current progress
 * it currently only logs data
 */
myfaces._impl.core._Runtime.extendClass("myfaces._supportive.unittest.StatisticsEngine", Object, {
    _numberOfTestsPerformed: 0,
    _numberOfTestsSucceeded: 0,
    _numberOfTestsFailed: 0,

    _performed: null,
    _fails: null,

    constructor_: function() {
        this._performed = [];
        this._fails = [];
    },

    attr: function(name, value) {
        if ('undefined' != typeof value) {
            this["_" + name] = value;
            return value;
        } else {
            return this["_" + name];
        }
    },

      /**
     * Simple assert true
     *
     * @param message the assertion message
     * @param assertionOutcome the assertion outcome (true or false)
     */
    assertTrue: function(testcase, message, assertionOutcome) {
        var _Lang = myfaces._impl._util._Lang;

        if (!assertionOutcome) {
            _Lang.logError(testcase,":", message, "assertionOutcome:", assertionOutcome);
            return false;
        }
        _Lang.logInfo(testcase,":",message, "assertionOutcome:", assertionOutcome);
        return true;
    },

    /**
     * Simple assert false
     *
     * @param message the assertion message
     * @param assertionOutcome the assertion outcome (true or false)
     */
    assertFalse: function(testCase, message, assertionOutcome) {
        var _Lang = myfaces._impl._util._Lang;

        if (assertionOutcome) {
            _Lang.logError(testCase,":",message, "assertionOutcome:", assertionOutcome);
            return false;
        }
        _Lang.logInfo(testCase,":", message, "assertionOutcome:", assertionOutcome);
        return true;
    },

    logInfo: function(testCase, message) {
        myfaces._impl._util._Lang.logInfo(testCase, message);
    },
    logDebug: function(testCase, message) {
        myfaces._impl._util._Lang.logDebug(testCase, message);
    },
    logError: function(testCase, message) {
        myfaces._impl._util._Lang.logError(testCase, message);
    },


    fail: function(testCase, message) {
        myfaces._impl._util._Lang.logError(testCase,":",message);
        return false;
    },

    finalSucceed: function() {
        this._numberOfTestsSucceeded ++;
        this._numberOfTestsPerformed ++;
    },

    finalFail: function(testCase) {
        this._numberOfTestsFailed ++;
        this._numberOfTestsPerformed ++;
        this._fails.push(testCase);
    },

    tearDown: function() {
        var _Lang = myfaces._impl._util._Lang;
        _Lang.logInfo("Number of tests performed", this._numberOfTestsPerformed);
        _Lang.logInfo("Number of tests succeeded", this._numberOfTestsSucceeded);
        _Lang.logInfo("Number of tests failed", this._numberOfTestsFailed);


        for(var cnt = 0; cnt < this._fails.length; cnt++) {
            _Lang.logError("Test Failed:", this._fails[cnt]);
        }
    }

});