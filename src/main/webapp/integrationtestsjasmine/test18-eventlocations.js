var successCalled = 0;

var assertSuccessPosition = false;

var oldResponse = jsf.ajax.response;
jsf.ajax.response = function (request, context) {
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
    myfaces.testcases.redirect("./finalResults.jsf");
});
describe("event location test, success must be called in response function", function () {
    it("runs the ajax cycle and checks for the proper event location of the success event", function () {
        runs(function () {
            jsf.ajax.request('idgiven', null, {
                execute: '@this',
                render: 'myVal',
                'javax.faces.behavior.event': 'action'
            });
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        }, "timeout", 10000);
        runs(function () {

            expect(assertSuccessPosition).toBeTruthy();
        })
    })
})