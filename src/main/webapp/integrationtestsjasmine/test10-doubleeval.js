afterEach(function () {
    myfaces.testcases.redirect("./test11-scriptblocks.jsf");
});
describe("Regression test for double eval on a single script element", function () {
    it("Runs the double eval test", function () {
        runs(function () {
            for (var cnt = 0; cnt < 2; cnt++) {
                jsf.ajax.request('reloader', null, {
                    execute:    '@none',
                    render:     'outputWriter',
                    'javax.faces.behavior.event': 'action'
                });
            }
        });
        waitsFor(function(){
            return myfaces.testcases.ajaxCnt >= 2;
        });
        runs(function(){
            var renderTargetHTML = $("#output").html();
            expect(renderTargetHTML == "0 1 2 ").toBeTruthy();  //
        });
    });
});