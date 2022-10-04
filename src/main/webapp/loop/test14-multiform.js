afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test17-responseonly.jsf");
    }, 1000);
});
var timer = null;
describe("Multi form situation", function () {

    afterEach(function () {
        clearInterval(timer);
    });
    it("runs multiform testing", function () {

        var promises = [];
        for (var cnt = 0; cnt < 100; cnt++) {
            if (cnt % 2) {
                $("#first_input").val(Math.random());

                promises.push(faces.ajax.request("first_input", null, {
                    execute: 'firstForm',
                    render: 'renderTarget1 renderTarget2'
                }));
            } else {

                $("#second_input").val(Math.random());
                promises.push(faces.ajax.request("second_input", null, {
                    execute: 'firstForm',
                    render: 'renderTarget1 renderTarget2'
                }));
            }
        }

        //no error after 100 requests we have passed
        Promise.all(promises).then(function() {

            expect(true).toBeTruthy();
        }).catch(function (val) {
            expect(false).toBeTruthy();
        });


    });

});