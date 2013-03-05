afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./finalResults.jsf");
    }, 1000);
});
describe("Execute none handling", function () {
    it("runs an execute request with execute @none", function () {
        runs(function () {
            document.getElementById("centerForm").action = "./test.mockup";
            jsf.ajax.request(document.getElementById("submitme"), null, {
                render: "booga @none",
                execute: "booga2 @none",
                op: "executeNone"
            });
        });
        waitsFor(function(){
            return !!myfaces.testcases.ajaxCnt;
        });
        runs(function(){
            expect(document.getElementById("result").innerHTML.indexOf("success")).not.toBe(-1);
        });
    });
});
