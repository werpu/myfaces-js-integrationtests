if (!window.viewRoot) {
    window.viewRoot = true;
    afterEach(function () {
        setTimeout(function () {
            myfaces.testcases.redirect("./test6-tablebasic.jsf");
        }, 1000);
    });
    describe("Viewroot with execute @all and render @all", function () {
        it("Needs to have the root replaced", function () {
            var htmlReporter = $("#HTMLReporter");
            runs(function () {

                htmlReporter.detach();
                jsf.ajax.request("allKeyword", null, {render: "@all", execute: "@all"});
            });

            waitsFor(function () {
                return !!myfaces.testcases.ajaxCnt;
            }, "server timeout", 10000);
            waitsFor(function(){
                return $("body").html().indexOf("refresh successul2") != -1;
            },"dom timeout", 3000);
            runs(function () {
                htmlReporter.appendTo("body");
                expect($("body").html().indexOf("refresh successul2")).not.toBe(-1);
            });
        })
    });
}
