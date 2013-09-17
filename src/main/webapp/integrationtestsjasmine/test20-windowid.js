afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("test21-windowid2.jsf", "jfwid=booga2");
    }, 1000);
});
describe("Window id tests", function () {
    beforeEach(function () {
        myfaces.testcases.ajaxCnt = 0;
    });
    it("has a windowid in the centerform", function () {
        var windowId = jsf.getClientWindow(document.getElementById("centerForm"));
        expect(windowId).not.toBeNull();
    });
    it("Tests for a windowId in a non id condition aka no form no url param", function () {
        var windowId = jsf.getClientWindow(document.getElementById("form2"));
        expect(windowId).toBeNull();
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
    it("Test for the  WindowId not being sent down the ajax cycle", function () {
        runs(function () {
            emitPPR(document.getElementById("input2"), null, 'windowId', 'form2');
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        });
        runs(function () {
            expect(document.getElementById("result").innerHTML != "Window Id is sent").toBeTruthy();
        });
    });
});