var target = "./test.mockup";
afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("finalResults.jsf");
    }, 1000);
});
describe("PPR Test for resetValues", function () {
    beforeEach(function () {
        $("#result").html("");
        myfaces.testcases.ajaxCnt = 0;
    });
    it("emitting ppr request with resetValues = true", function () {
        document.getElementById("centerForm").action = target;
        jsf.ajax.request("input1", null, {op: "resetValues", resetValues: true});

        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        });
        runs(function () {
            expect($("#result").html() == "success").toBeTruthy();
        });
    });
    it("emitting ppr request with resetValues = other than true", function () {
        document.getElementById("centerForm").action = target;
        jsf.ajax.request("input1", null, {op: "resetValues", resetValues: "true"});

        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        });
        runs(function () {
            expect($("#result").html() != "success").toBeTruthy();
        });
    });
    it("emitting ppr request with resetValues = other than true", function () {
        document.getElementById("centerForm").action = target;
        jsf.ajax.request("input1", null, {op: "resetValues", resetValues: false});

        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        });
        runs(function () {
            expect($("#result").html() != "success").toBeTruthy();
        });
    });
    it("emitting ppr request without resetValues", function () {
        document.getElementById("centerForm").action = target;
        jsf.ajax.request("input1", null, {op: "resetValues"});

        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        });
        runs(function () {
            expect($("#result").html() != "success").toBeTruthy();
        });
    });

});


