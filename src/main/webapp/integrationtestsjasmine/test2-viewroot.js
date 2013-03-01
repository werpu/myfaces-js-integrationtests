afterEach(function() {
    myfaces.testcases.redirect("./test3-viewbody.jsf");
});
describe("Full root replacement via protocol view root", function () {
    it("Should run the ajax and replace the viewroot", function () {
        var htmlReporter = $("#HTMLReporter");
        runs(function () {
            htmlReporter.detach();
            emitPPR("form1", null, "body");
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        }, "Server timeout", 10000);
        runs(function(){
          htmlReporter.appendTo("body");
          expect($("#scriptreceiver").html().indexOf("hello from embedded script")).not.toBe(-1);
        });
    });
});
