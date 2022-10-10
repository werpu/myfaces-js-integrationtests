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
        myfaces.testcases.redirect("./test17-responseonly.jsf");
    }, 1000);
});
let timer = null;
describe("Multi form situation", function () {

    afterEach(function () {
        clearInterval(timer);
    });
    it("runs multiform testing", function () {

        let promises = [];
        for (let cnt = 0; cnt < 100; cnt++) {
            if (cnt % 2) {
                $("#first_input").val(Math.random());

                promises.push(faces.ajax.request("first_input", null, {
                    execute: 'firstForm',
                    render: 'renderTarget1 renderTarget2'
                }));
            } else {

                $("#second_input").val(Math.random());
                promises.push(faces.ajax.request("second_input", null, {
                    execute: 'firstForm',
                    render: 'renderTarget1 renderTarget2'
                }));
            }
        }

        //no error after 100 requests we have passed
        Promise.all(promises).then(function() {

            expect(true).toBeTruthy();
        }).catch(function (val) {
            expect(false).toBeTruthy();
        });


    });

});