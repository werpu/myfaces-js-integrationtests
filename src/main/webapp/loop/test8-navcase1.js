afterEach(function () {
    setTimeout(function () {
        //myfaces.testcases.redirect("./test9-spreadsheet.jsf");
        myfaces.testcases.redirect("./test8-navcase1.jsf");
    }, 1000);
});
describe("Partial Page Rendering Nav Case", function () {
    it("Nav Case Test", function (done) {
        var htmlReporter = $(".jasmine_html-reporter");


        htmlReporter.detach();
        $("#firstName").val("Werner");
        $("#lastName").val("Tester");
        $("#city").val("Linz");
        $("#zip").val("Tester");
        jsfAjaxRequestPromise('forward', null, {
            execute: 'mainForm',
            render: 'fullContent',
            'jakarta.faces.behavior.event': 'action'
        }).then(function () {
            setTimeout(function () {
                htmlReporter.appendTo("body");
                expect($("span#firstName").html().indexOf("Werner")).not.toBe(-1);
                expect($("span#lastName").html().indexOf("Tester")).not.toBe(-1);
                expect($("body").html().indexOf("script executed")).not.toBe(-1);
                done();
            }, 500);
        }).catch(ex => {
            console.error(ex)
            fail();
        });
    });
});