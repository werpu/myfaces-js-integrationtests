afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test17-responseonly.jsf");
    }, 1000);
});
var timer = null;
describe("Multi form situation", function () {
    beforeEach(function () {
        timer = setInterval(function(){
            $("#first_input").val(Math.random());
            $("#second_input").val(Math.random());
        }, 10);
    });
    afterEach(function () {
        clearInterval(timer);
    });
    it("runs multiform testing", function () {
        runs(function () {
            for (var cnt = 0; cnt < 100; cnt++) {
                if (cnt % 2) {
                    jsf.ajax.request("first_input", null, {
                        execute: 'firstForm',
                        render: 'renderTarget1 renderTarget2'
                    });
                } else {
                    jsf.ajax.request("second_input", null, {
                        execute: 'firstForm',
                        render: 'renderTarget1 renderTarget2'
                    });
                }
            }
        });
        waitsFor(function () {
            return myfaces.testcases.ajaxCnt >= 100;
        });
        runs(function () {
            //no error after 100 requests we have passed
            expect(true).toBeTruthy();
        });

    });

});