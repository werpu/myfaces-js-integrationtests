afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test12-apidecoration.jsf");
    }, 1000);
});
describe("Script blocks in various formats", function () {
    it("Performs a script bloc test", function (done) {

        $("#resultArea").html("");
        jsfAjaxRequestPromise('reloader', null, {
            execute: '@none',
            render: 'outputWriter',
            'jakarta.faces.behavior.event': 'action'
        }).finally(function () {
            setTimeout(function () {
                expect($(".result2").html() == "normal script --&gt;").toBeTruthy();//contents of result2 must match
                expect($(".result3").html() == "normal script --&gt;").toBeTruthy();//contents of result3 must match
                expect($(".result4").html() == "normal script ]]&gt;").toBeTruthy();//contents of result4 must match
                done();
            }, 500);
        });

    });
});