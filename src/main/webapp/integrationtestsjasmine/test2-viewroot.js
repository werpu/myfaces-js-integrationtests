afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test3-viewbody.jsf");
    }, 1000);
});
describe("Full root replacement via protocol view root", function () {
    it("Should run the ajax and replace the viewroot", function (done) {
        var htmlReporter = $(".jasmine_html-reporter");
        htmlReporter.detach();
        emitPPR("form1", null, "body").then(function () {
            setTimeout(function () {
                htmlReporter.appendTo("body");
                expect($("#scriptreceiver").html().indexOf("hello from embedded script")).not.toBe(-1);
                done();
            }, 500);
        });
    });
});
