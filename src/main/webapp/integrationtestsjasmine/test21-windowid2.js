afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("finalResults.jsf");
    }, 1000);
});
describe("Window id tests part 2", function () {
    beforeEach(function () {
        myfaces.testcases.ajaxCnt = 0;
    });
    it("Test for a valid window id for a given form", function () {
        var windowId = jsf.getClientWindow(document.getElementById("centerForm"));
        expect(windowId != null).toBeTruthy();
    });
    it("Test for a valid window id given a url windowid", function () {
        var windowId = jsf.getClientWindow(document.getElementById("form2"));
        expect(windowId == "booga2").toBeTruthy();
    });
    it("Test for a WindowId being sent down the ajax cycle", function () {
        runs(function () {
            emitPPR(document.getElementById("input1"), null, 'windowId', 'centerForm');
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        });
        runs(function () {
            expect(document.getElementById("result").innerHTML == "Window Id is sent").toBeTruthy();
        });
    });
    it("Test for the  WindowId being sent down the ajax cycle over the url parameter", function () {
        runs(function () {
            emitPPR(document.getElementById("input2"), null, 'windowId', 'form2');
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        });
        runs(function(){
            expect(document.getElementById("result").innerHTML == "Window Id is sent").toBeTruthy();
        });
    });
});
