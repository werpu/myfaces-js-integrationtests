var successCalled = 0;

var assertSuccessPosition = false;

var oldResponse = faces.ajax.response;
faces.ajax.response = function (request, context) {

    var newContext = {};
    newContext.source = context.source;
    newContext.onevent = function (evt) {
        if (evt.status == "success") {
            successCalled++;
        }
        if (context.onevent) {
            context.onevent(evt);
        }
    };



    assertSuccessPosition = successCalled == 0;
    oldResponse(request, newContext);
    assertSuccessPosition = assertSuccessPosition && successCalled == 1;
};

afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test19-execute.jsf");
    }, 1000);
});
describe("event location test, success must be called in response function", function () {
    it("runs the ajax cycle and checks for the proper event location of the success event", function (done) {

        jsfAjaxRequestPromise('idgiven', null, {
            execute: '@this',
            render: 'myVal',
            'jakarta.faces.behavior.event': 'action'
        }).finally(function () {
            setTimeout(function () {
                expect(assertSuccessPosition).toBeTruthy();
                done();
            }, 500);
        });
    });
});