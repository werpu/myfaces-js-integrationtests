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

let req,resp, viest;

beforeEach(function () {


    let oldReq = jsf.ajax.request;
    jsf.ajax.request = function(element, event, options) {
        try {
            req = true;
            oldReq(element, event, options);
        } finally {
            jsf.ajax.request = oldReq;
        }
    }
    let oldResp = jsf.ajax.response;
    jsf.ajax.response = (request, context) => {
        try {
            resp = true;
            oldResp(request, context);
        } finally {
            jsf.ajax.response = oldResp;
        }
    };
    let oldViewst = jsf.getViewState;
    jsf.getViewState = (formElement) => {
        try {
            viest = true;
            oldViewst(formElement);
        } finally {
            jsf.getViewState = oldViewst;
        }
    };
});
afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test13-cssreplacementhead.jsf");
    }, 1000);
});
describe("Test for decoratable calls within our jsf lifecycle", function () {
    it("checks whether all functions are properly called", function (done) {
        jsfAjaxRequestPromise('reloader', null, {
            execute: '@none',
            render: 'outputWriter',
            'jakarta.faces.behavior.event': 'action'
        }).then(() => {
            DQ$("body")
                .waitUntilDom(() => req && resp && viest)
                .then(() => {
                success(done);
            });
        }).catch(done);
    });
});