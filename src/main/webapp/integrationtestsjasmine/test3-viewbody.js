afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test4-chain.jsf");
    }, 1000);
});
describe("Full body replacement via protocol view body", function () {
    it("Should run the ajax and replace the body", function (done) {
        let htmlReporter = DomQuery.querySelectorAll(".jasmine_html-reporter");
        htmlReporter.detach();
        emitPPR("form1", null, "body2").then(function () {
            setTimeout(function () {
                htmlReporter.appendTo(DomQuery.querySelectorAll("body"));
                let html = DomQuery.querySelectorAll("body").html().value;
                expect(html.indexOf("testResults59")).not.toBe(-1);
                expect(html.indexOf("Body replacement test successful")).not.toBe(-1);
                done();
            }, 500);
        });

    });
});
