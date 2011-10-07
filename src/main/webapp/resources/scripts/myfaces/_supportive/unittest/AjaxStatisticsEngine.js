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
 * An implementation of the statistics engine which sends the jsoned
 * data down to a collectors servlet once a testgroup is performed
 *
 * the data schema is
 * groups [{
 *  groupName{
 *      testCases:[ {
 *          name:<testcaseName>
 *          assertions: [{
 *              type: <AssertTrue, AssertFalse, Fail>
 *              outcome: <true, false>
 *              message: <Message>
 *              failure: <true, false>
 *          }]
 *          success: true|false
 *      }]*
 *      finalResult: {
 *          numberOfTestsPerformed: <No Performed>
 *          numberOfTestsSucceeded: <No Succeeded>
 *          numberOfTestsFailed: <NoFailed>
 *      }
 *  }
 * }]
 */
myfaces._impl.core._Runtime.extendClass("myfaces._supportive.unittest.AjaxStatisticsEngine", myfaces._supportive.unittest.StatisticsEngine, {

    _serviceUrl: null,
    _groupsPerformed: null,
    _currentGroup: null,
    _currentTestCase: null,

    constructor_:function(args) {
        this._callSuper("constructor_", args);
        this._groupsPerformed = [];
    },

    startTestGroup: function(testGroupName) {
        this._callSuper("startTestGroup", testGroupName);
        this._currentGroup = {};
        this._currentGroup.name = testGroupName;
        this._currentGroup.testCases = [];
        this._currentGroup.finalResult = {};
        this._currentGroup.finalResult.numberOfTestsPerformed = 0;
        this._currentGroup.finalResult.numberOfTestsSucceeded = 0;
        this._currentGroup.finalResult.numberOfTestsFailed = 0;
    },

    startTestCase: function(testCaseName) {
        this._callSuper("startTestCase", testCaseName);
        this._currentTestCase = {};
        this._currentTestCase.name = testCaseName;
        this._currentTestCase.assertions = [];
        this._currentTestCase.success = true;
    },

    endTestCase: function(testCaseName) {
        this._callSuper("endTestCase", testCaseName);
    },

    endTestGroup: function(groupName) {
        this._callSuper("endTestGroup", groupName);
        this._currentGroup.finalResult.numberOfTestsPerformed = this._numberOfTestsPerformed;
        this._currentGroup.finalResult.numberOfTestsSucceeded = this._numberOfTestsSucceeded;
        this._currentGroup.finalResult.numberOfTestsFailed = this._numberOfTestsFailed;
    },

    assertTrue: function(testCase, message, assertionOutcome) {
        this._callSuper("assertTrue", testCase, message, assertionOutcome);
        var assertion = {};
        assertion.type = "assertTrue";
        assertion.message = message;
        assertion.outcome = assertionOutcome;
        assertion.failure = !assertionOutcome;
    },

    assertFalse: function(testCase, message, assertionOutcome) {
        this._callSuper("assertTrue", testCase, message, assertionOutcome);
        var assertion = {};
        assertion.type = "assertFalse";
        assertion.message = message;
        assertion.outcome = assertionOutcome;
        assertion.failure = assertionOutcome;
    },

    fail: function(testCase, message) {
        this._callSuper("fail", testCase, message);
        var assertion = {};
        assertion.type = "assertFalse";
        assertion.message = message;
        assertion.outcome = false;
        assertion.failure = true;
    },
    /*send the test results down the server
     * via a synchronous http post*/
    _sendTestResults: function() {
        var xhr = new myfaces._impl.xhrCore.engine.Xhr1();
        var data = "testGroup="+escape(this._array2json(this._groupsPerformed));
        xhr.open("post",this._serviceUrl, false);
        xhr.send(data);

    }
    ,/**
     * Converts the given data structure to a JSON string.
     * Argument: arr - The data structure that must be converted to JSON
     * Example: var json_string = array2json(['e', {pluribus: 'unum'}]);
     *             var json = array2json({"success":"Sweet","failure":false,"empty_array":[],"numbers":[1,2,3],"info":{"name":"Binny","site":"http:\/\/www.openjs.com\/"}});
     * http://www.openjs.com/scripts/data/json_encode.php
     */
    _array2json: function(arr) {
        var parts = [];
        var is_list = (Object.prototype.toString.apply(arr) === '[object Array]');

        for (var key in arr) {
            var value = arr[key];
            if (typeof value == "object") { //Custom handling for arrays
                if (is_list) parts.push(array2json(value)); /* :RECURSION: */
                else parts[key] = array2json(value);
                /* :RECURSION: */
            } else {
                var str = "";
                if (!is_list) str = '"' + key + '":';

                //Custom handling for multiple data types
                if (typeof value == "number") str += value; //Numbers
                else if (value === false) str += 'false'; //The booleans
                else if (value === true) str += 'true';
                else str += '"' + value + '"'; //All other things
                // :TODO: Is there any more datatype we should be in the lookout for? (Functions?)

                parts.push(str);
            }
        }
        var json = parts.join(",");

        if (is_list) return '[' + json + ']';//Return numerical JSON
        return '{' + json + '}';//Return associative JSON
    }



});

