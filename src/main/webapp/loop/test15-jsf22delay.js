//TODO this test needs further improvement or a complete rewrite
afterEach(function () {
    myfaces.testcases.redirect("./finalResults.jsf");
});
describe("JSF 22 delay test", function () {
    it("Runs the delay test", function () {


            var promises = [];

            promises.push(jsfAjaxRequestPromise(document.getElementById("delayControl"), null, {
                execute: "delayControl",
                render: "delayoutput",
                op: "cleardelay"
            }));
            for (var cnt = 0; cnt < 100; cnt++) {
                promises.push(jsfAjaxRequestPromise(document.getElementById("delayControl"), null, {
                    execute: "delayControl",
                    render: "delayoutput",
                    op: "delay",
                    delay: 500,
                    myfaces: {delay: 500}
                }));
            }

        Promise.all(promises).finally(function () {
            setTimeout(function () {
                expect(document.getElementById("delayoutput").innerHTML.indexOf("Number of requests so far 1") != -1).toBeTruthy(); //"Check for correct content",
            }, 500)
        })
    });
});