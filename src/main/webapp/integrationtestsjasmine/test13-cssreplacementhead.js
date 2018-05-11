afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test14-multiform.jsf");
    }, 1000);
});
describe("CSS Head replacement test", function () {
    it("replaces the head and checks whether the css has been replaced", function (done) {
        var htmlReporter = $(".jasmine_html-reporter");

            htmlReporter.detach();
            jsfAjaxRequestPromise('nextPage', null, {
                execute: 'mainForm',
                render: '@all',
                'javax.faces.behavior.event': 'action'
            }).finally(function () {
                htmlReporter.appendTo("body");
                setTimeout(function () {
                    expect($("#div1").width() > 120).toBeTruthy();//"div1 has no width anymore",
                    expect($("#div2").width() > 120).toBeTruthy();//"div2 has no width anymore",
                    expect($("#div3").width() > 120).toBeTruthy();//"div3 has no width anymore",
                    expect($("#div4").width() < 120).toBeTruthy();//"div4 has a width",
                    expect($("#div5").width() < 120).toBeTruthy();//"div5 has a width",
                    expect($("#div6").width() < 120).toBeTruthy();//"div6 has a width",
                    expect($("#div7").width() < 120).toBeTruthy();//"div6 has a width",
                    done();
                }, 500);

            });


    });

});