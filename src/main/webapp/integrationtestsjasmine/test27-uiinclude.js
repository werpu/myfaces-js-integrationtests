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
    myfaces.testcases.redirect("./finalResults.jsf");
});



describe("Simple Push Testing", function () {

    it("runs a basic viewroot include switch", function (done) {
        if(window.already_run) {
            done();
            return;
        }
        window["already_run"] = true;
        // For whatever reasons the combination innerHTML and MutationObservers seems to be broken on push notifications
        // browser bug
        let p1State =  DQ$("body").innerHTML.indexOf("Page 1") != -1;
        let htmlReporter = DQ$(".jasmine_html-reporter");
        htmlReporter.detach();

        setTimeout(()=> {
            DQ$("body").append(htmlReporter);
            expect(DQ$("body").innerHTML.indexOf("Page " + (p1State) ? 2 : 1)).toBeGreaterThan( -1);
            done();
        }, 500)
        DQ$("#submitter").click();
    });

});

