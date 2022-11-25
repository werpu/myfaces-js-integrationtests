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
afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./finalResults.jsf");
    }, 1000);
});

describe("Head replacement tests", function () {

        it("runs a head replacement", function (done) {
            emitPPR("execute_head", null, "head_replace1").then(function () {
                //another faster and better way we use wait untilDom
                DomQuery.byTagName("body")
                    .waitUntilDom(() => DQ$("#result_area").innerHTML == "eval success")
                    .then(() => {
                        expect(DQ$("#result_area2").innerHTML == "eval success").toBe(true);
                        expect(DQ$("head meta").length).toEqual(5);
                        expect(DQ$("head script").length).toEqual(2);
                        expect(DQ$("head link").length).toEqual(2);
                        done();
                    }).catch(done);
            })
        });

});

