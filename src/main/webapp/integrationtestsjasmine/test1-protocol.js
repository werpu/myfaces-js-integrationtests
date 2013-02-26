
afterEach(function() {
    window.location.href = "./test2-viewroot.jsf";
});

describe("Testsuite testing the protocol", function () {
    it("It should run an Eval Ajax command", function () {
        runs(function () {
            emitPPR("cmd_eval", null, "eval1")
        });

        waitsFor(function () {
            return myfaces.testcases.ajaxFinished;
        }, "Server timeout", 10000);

        runs(function () {
            var innerText = $("#evalarea1").html();
            expect(innerText.toLowerCase().indexOf("succeed")).not.toBe(-1);
        });
    });

    it("It should run Update Insert Spec - Insert Path", function () {
        runs(function () {
            emitPPR("cmd_update_insert2", null, "updateinsert2");
        });
        waitsFor(function () {
            return myfaces.testcases.ajaxFinished;
        }, "Server timeout", 10000);
        runs(function () {
            var innerText = $("#evalarea2").html();
            expect(innerText.toLowerCase().indexOf("succeed")).not.toBe(-1);
            innerText = $("#evalarea3").html();
            expect(innerText.toLowerCase().indexOf("succeed")).not.toBe(-1);
            //insert before must exist
            expect(!!$("#insertbefore").length).toBe(true);
            expect(!!$("#insertafter").length).toBe(true);
            $("#insertbefore").remove();
            $("#insertafter").remove();
        });
    });

    it("It should run delete", function () {
        runs(function () {
            emitPPR("cmd_delete", null, "delete1");
        });
        waitsFor(function () {
            return myfaces.testcases.ajaxFinished;
        }, "Server timeout", 10000);
        runs(function () {
            var deleteGone = !!document.getElementById("deleteable");
            expect(deleteGone).toBe(false);
            if (deleteGone) {
                $("#testResults").append("<div id='deleteable'>deletearea readded by automated test</div>");
            }
        });
    });

    it("Should run change attributes", function () {
        runs(function () {
            emitPPR("cmd_attributeschange", null, "attributes");
        });
        waitsFor(function () {
            return myfaces.testcases.ajaxFinished;
        }, "Server timeout", 10000);
        runs(function () {
            var style = $("#attributeChange").css("border-bottom-width");
            expect(style.indexOf("1px")).not.toBe(-1);
            $("#attributeChange").css("border", "0px solid black");
        });
    });

    it("should trigger Error Trigger Ajax Illegal Response", function () {
        runs(function () {
            emitPPR("cmd_illegalresponse", null, "illegalResponse");
        });
        waitsFor(function () {
            return myfaces.testcases.ajaxFinished;
        }, "Server timeout", 10000);
        runs(function () {
            expect(myfaces.testcases.ajaxEvent.type === "error").toBe(true);
            expect(myfaces.testcases.ajaxEvent.status === "malformedXML").toBe(true);
            expect(myfaces.testcases.ajaxEvent.responseCode == 200).toBe(true);
            expect(myfaces.testcases.ajaxEvent.source.id == "cmd_illegalresponse").toBeTruthy();
        });

    });

    it("Should trigger an ajax server error and onerror and onsuccess must have been called in this case", function () {
        runs(function () {
            emitPPR("cmd_error", null, "errors");
        });
        waitsFor(function () {
            return myfaces.testcases.ajaxFinished;
        }, "Server timeout", 10000);
        runs(function() {
            //onerror and oncomplete must have been called in this case
            expect(myfaces.testcases.ajaxEvents["error"] && myfaces.testcases.ajaxEvents["success"]).toBeTruthy();
        });
    });


});

