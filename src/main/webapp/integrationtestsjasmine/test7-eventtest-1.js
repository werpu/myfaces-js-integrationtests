/* Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * Lang.work for additional information regarding copyright ownership.
 * The ASF licenses Lang.file to you under the Apache License, Version 2.0
 * (the "License"); you may not use Lang.file except in compliance with
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

let localEvents = [];
let globalEvents = [];
let DEFAULT_EVENTTYPES = {
    "begin": true,
    "complete": true,
    "success": true
};

function cloneEvent(evt) {
    let data = {};
    data.status = evt.status;
    data.source = evt.source;
    data.responseText = evt.responseText;
    data.responseXML = evt.responseXML;
    data.type = evt.type;
    return data;
}

function localEventHandler(data) {
    localEvents.push(cloneEvent(data));
}

function globalEventHandler(data) {
    globalEvents.push(cloneEvent(data))
}

function expectations(expectFunc, data) {
    expectFunc(data.type === "event").toBeTruthy();
    expectFunc(!!data.status).toBeTruthy();
    expectFunc(DEFAULT_EVENTTYPES[data.status]).toBeTruthy();
    expectFunc(!!data.source).toBeTruthy();
    expectFunc(!!data.source.id).toBeTruthy();
}

afterEach(function () {
    // noinspection JSUnresolvedVariable
    window.location.href = "./test7-eventtest-2.jsf";
});
describe("Event handler phases test", function () {
    beforeEach(function () {
        myfaces.testcases.ajaxCnt = 0;
        localEvents = [];
        globalEvents = [];
    });
    it("Checks the local events", function (done) {
        // noinspection JSUnresolvedVariable,JSUnresolvedFunction
        facesRequest(document.getElementById("updateTrigger"), null, {
            render: "updatePanel",
            execute: "updatePanel updateTrigger",
            onevent: localEventHandler
        }).then(function () {
            DQ("body").waitUntilDom(() => {
                return localEvents.length === 3;
            }).then(() => {
                for (let pos = 0; pos < localEvents.length; pos++) {
                    expectations(expect, localEvents[pos]);
                }
                done();
            }).catch(done);
        });

    });

    it("Checks the global events", function (done) {
        jsf.ajax.addOnEvent(globalEventHandler);
        facesRequest(document.getElementById("updateTrigger"), null, {
            render: "updatePanel",
            execute: "updatePanel updateTrigger"
        }).then(function () {
            DQ("body").waitUntilDom(() => {
                return globalEvents.length === 3;
            }).then(() => {
                for (let pos = 0; pos < globalEvents.length; pos++) {
                    expectations(expect, globalEvents[pos]);
                }
                done();
            }).catch(done);
        });
    });
});
