afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test12-apidecoration.jsf");
    }, 1000);
});
describe("Script blocks in various formats", function () {
    it("Performs a script bloc test", function () {
        runs(function () {
            $("#resultArea").html("");
            jsf.ajax.request('reloader', null, {
                execute: '@none',
                render: 'outputWriter',
                'javax.faces.behavior.event': 'action'
            });
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        });
        runs(function () {
            expect($(".result2").html() == "normal script --&gt;").toBeTruthy();//contents of result2 must match
            expect($(".result3").html() == "normal script --&gt;").toBeTruthy();//contents of result3 must match
            expect($(".result4").html() == "normal script ]]&gt;").toBeTruthy();//contents of result4 must match
        });
    });
});