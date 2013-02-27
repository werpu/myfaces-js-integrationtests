afterEach(function() {
    myfaces.testcases.redirect("./test6-tablebasic.jsf");
});
describe("Viewroot with execute @all and render @all", function () {
    var timedOut = false;
    it("Needs to have the root replaced", function () {
        runs(function () {
            jsf.ajax.request("allKeyword", null, {render: "@all",execute: "@all"});
        });

        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        }, "server timeout", 10000);

        setTimeout(function () {
            timedOut = true;
        }, 3000);

        //now we wait 3000 ms so that the embedded script now is executed
        waitsFor(function () {
            return timedOut;
        }, "no timeout cannot happen", 10000);

        runs(function () {
            expect($("body").html().indexOf("refresh successul2")).not.toBe(-1);
        });
    })
});
