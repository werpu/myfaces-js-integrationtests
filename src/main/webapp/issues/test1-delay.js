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

describe("Full root replacement via protocol view root", function () {
    it("Should run the ajax and replace the viewroot", function (done) {
        let htmlReporter = DQ$(".jasmine_html-reporter");
        htmlReporter.detach();

        jsf.ajax.request(document.getElementById("cmd_body1"), null, {
            execute: "cmd_body1",
            render: "@form",
            delay: 10,
            params: {
                pass1: "pass1",
                pass2: "pass2",
            }
        });



        try {
            jsf.ajax.request(document.getElementById("cmd_body1"), null, {
                execute: "cmd_body1",
                render: "@form",
                delay: "NaN",
                params: {
                    pass1: "pass1",
                    pass2: "pass2",
                }
            });
        } catch (e) {
            done();
            console.log("success");
            return;
        }
        console.error("Test failed");
        done(false);
    });
});
