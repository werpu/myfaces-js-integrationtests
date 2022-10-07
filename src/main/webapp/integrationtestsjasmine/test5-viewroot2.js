if (!window.viewRoot) {
    window.viewRoot = true;

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        setTimeout(function () {
            myfaces.testcases.redirect("./test6-tablebasic.jsf");
        }, 1000);
    });

    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });


    let env = getJasmineRequireObj().Env;
    describe("Viewroot with execute @all and render @all", function () {

        beforeEach(function (done) {
            let htmlReporter = $(".jasmine_html-reporter");
            htmlReporter.detach();
            //render all kills the new jasmine code because it kills off old script configs
            jsfAjaxRequestPromise("allKeyword", null, {render: "@all", execute: "@all"}).then(function () {

                setTimeout(function() {
                    htmlReporter.appendTo("body");
                    done();
                }, 1000)

            });

        });

        it("Needs to have the root replaced", function () {
            //return setTimeout(function () {
            //getJasmineRequireObj().Env = env;
                    //expect($("body").html().indexOf("refresh successul2")).not.toBe(-1);
            if($("body").html().indexOf("refresh successul2") == -1) {
                throw new Error("Test not passed");
            }

        });
    });

}
