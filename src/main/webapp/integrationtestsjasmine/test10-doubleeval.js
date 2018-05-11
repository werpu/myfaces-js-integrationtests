afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test11-scriptblocks.jsf");
    }, 1000);
});
describe("Regression test for double eval on a single script element", function () {
    it("Runs the double eval test", function (done) {

        var promises = [];
        for (var cnt = 0; cnt < 2; cnt++) {
            promises.push(jsfAjaxRequestPromise('reloader', null, {
                execute: '@none',
                render: 'outputWriter',
                'javax.faces.behavior.event': 'action'
            }));
        }
        Promise.all(promises).finally(function () {
            setTimeout(function () {
                var renderTargetHTML = $("#output").html();
                expect(renderTargetHTML == "0 1 2 ").toBeTruthy();  //
                done();
            })
        });
    });
});