//TODO this test needs further improvement or a complete rewrite
afterEach(function () {
    myfaces.testcases.redirect("./finalResults.jsf");
});
describe("JSF 22 delay test", function () {
    it("Runs the delay test", function () {
        runs(function () {
            jsf.ajax.request(document.getElementById("delayControl"), null, {
                execute: "delayControl",
                render: "delayoutput",
                op: "cleardelay"
            });
            for (var cnt = 0; cnt < 100; cnt++) {
                jsf.ajax.request(document.getElementById("delayControl"), null, {
                    execute: "delayControl",
                    render: "delayoutput",
                    op: "delay",
                    delay: 500,
                    myfaces: {delay: 500}
                });
            }
        });
        waits(2000);
        runs(function(){
           expect(document.getElementById("delayoutput").innerHTML.indexOf("Number of requests so far 1") != -1).toBeTruthy(); //"Check for correct content",
        });
    });
});