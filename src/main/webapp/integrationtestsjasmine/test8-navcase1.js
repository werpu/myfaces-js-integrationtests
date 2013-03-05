afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test9-spreadsheet.jsf");
    }, 1000);
});
describe("Partial Page Rendering Nav Case", function () {
    it("Nav Case Test", function () {
        var htmlReporter = $("#HTMLReporter");
        runs(function () {
            htmlReporter.detach();
            $("#firstName").val("Werner");
            $("#lastName").val("Tester");
            $("#city").val("Linz");
            $("#zip").val("Tester");
            jsf.ajax.request('forward', null, {
                execute: 'mainForm',
                render: 'fullContent',
                'javax.faces.behavior.event': 'action'
            });
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        }, "timeout", 10000);
        //we have to wait for a script in the page
        // to be executed via a timeout
        waits(1000);
        runs(function(){
            htmlReporter.appendTo("body");
            expect($("span#firstName").html().indexOf("Werner")).not.toBe(-1);
            expect($("span#lastName").html().indexOf("Tester")).not.toBe(-1);
            expect( $("body").html().indexOf("script executed")).not.toBe(-1);
        });
    });
});