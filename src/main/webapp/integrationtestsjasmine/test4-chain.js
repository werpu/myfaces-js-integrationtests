afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test5-viewroot2.jsf");
    }, 1000);
});
describe("Chain function suite", function () {
    it("Should process jsf.util.chain properly", function () {
        //testfunc1 til 4 are defined in the html page
        jsf.util.chain(document.getElementById("chaincall"), null, testFunc1, testFunc2, testFunc3, testFunc4);
        expect($("body").html().indexOf("test1 succeeded test2 succeededtest3 succeeded")).not.toBe(-1);
    });
});