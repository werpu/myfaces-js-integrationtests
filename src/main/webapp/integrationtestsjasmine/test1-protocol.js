afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test2-viewroot.jsf");
    }, 1000);
});

function _it(parm) {

}


describe("Testsuite testing the protocol", function () {
    beforeEach(function () {
        //we reset the ajax counter before each spec
        //because every spec has only one ajax request
        //and needs the counter to detect the end of the
        //ajax cycle
        myfaces.testcases.ajaxCnt = 0;
    });
    it("It should run an Eval Ajax command", function (done) {

        emitPPR("cmd_eval", null, "eval1").then(function () {
            //another faster and better way we use wait untilDom
            const condition = (element) => {
                let innerText = element.html().value;
                return innerText.toLowerCase().indexOf("succeed");
            };
            DomQuery.querySelectorAll("#evalarea1").waitUntilDom(condition).then(() => {
                expect(true).toEqual(true);
                done();
            }).catch(done);
        })
    });

    it("It should run Update Insert Spec - Insert Path", function (done) {

        emitPPR("cmd_update_insert2", null, "updateinsert2").then(function () {

            setTimeout(function () {
                let innerText = DomQuery.byId("evalarea2").html().value;
                expect(innerText.toLowerCase().indexOf("succeed")).not.toBe(-1);
                innerText = DomQuery.byId("evalarea3").html().value;
                expect(innerText.toLowerCase().indexOf("succeed")).not.toBe(-1);
                //insert before must exist
                let insertBefore = DomQuery.byId("insertbefore");
                let insertAfter = DomQuery.byId("insertafter");
                expect(!!insertBefore.length).toBe(true);
                expect(!!insertAfter.length).toBe(true);
                insertBefore.delete();
                insertAfter.delete();
                done();
            }, 500);
        });
    });

    it("It should run delete", function (done) {

        emitPPR("cmd_delete", null, "delete1").then(function () {
            DomQuery.byId("deleteable").waitUntilDom((element) => element.isAbsent())
                .then(() => {
                    let newNode = DomQuery.fromMarkup("<div id='deleteable'>deletearea readded by automated test</div>");
                    newNode.appendTo(DomQuery.byId("testResults"));
                    done();
                }).catch(done);
        });
    });

    it("Should run change attributes", function (done) {

        emitPPR("cmd_attributeschange", null, "attributes").catch(ex => {
            fail();
        }).then(function () {
            DomQuery.byId("attributeChange")
                .waitUntilDom((element) => element.style('borderWidth').value == "1px")
                .then((element) => {
                    element.style('borderWidth').value = "0px";
                    done();
                }).catch(done);
        });
    });

    it("should trigger Error Trigger Ajax Illegal Response", function (done) {

        emitPPR("cmd_illegalresponse", null, "illegalResponse").then(() => {
            fail();
        }).catch(function () {
            setTimeout(function () {
                expect(myfaces.testcases.ajaxEvent.type === "error").toBeTruthy();
                expect(myfaces.testcases.ajaxEvent.status === "malformedXML").toBeTruthy();
                expect(myfaces.testcases.ajaxEvent.responseCode == 200).toBeTruthy();
                expect(myfaces.testcases.ajaxEvent.source.id == "cmd_illegalresponse").toBeTruthy();
                done();
            }, 500);
        });
    });

    it("Should trigger an ajax server error and onerror and onsuccess must have been called in this case", function (done) {

        emitPPR("cmd_error", null, "errors").catch(function () {
            DomQuery.byId("body")
                .waitUntilDom(() => myfaces.testcases.ajaxEvents["error"] && myfaces.testcases.ajaxEvents["success"])
                .then(done)
                .catch(done);
        });
    });
});

