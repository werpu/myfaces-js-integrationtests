afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./finalResults.jsf");
    }, 1000);
});
describe("Execute none handling", function () {
    it("runs an execute request with execute @none", function () {


            jsfAjaxRequestPromise(document.getElementById("submitme"), null, {
                render: "booga @none",
                execute: "booga2 @none",
                op: "executeNone"
            }).finally(function () {
                setTimeout(function () {
                    expect(document.getElementById("result").innerHTML.indexOf("success")).not.toBe(-1);
                }, 500);
            });

    });
});
