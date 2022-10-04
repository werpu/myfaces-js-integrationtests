afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test11-scriptblocks.jsf");
    }, 1000);
});
describe("Regression test for double eval on a single script element", function () {
    it("Runs the double eval test", function (done) {

        let promises = [];
        for (let cnt = 0; cnt < 2; cnt++) {
            promises.push(jsfAjaxRequestPromise('reloader', null, {
                execute: '@none',
                render: 'outputWriter',
                'jakarta.faces.behavior.event': 'action'
            }));
        }
        let beDone = () => {
            setTimeout(function () {
                let renderTargetHTML = $("#output").html();
                expect(renderTargetHTML == "0 1 2 ").toBeTruthy();  //
                done();
            })
        }
        Promise.all(promises).then(() => {
            beDone();
        }).catch(() => {
            beDone()
        });
    });
});