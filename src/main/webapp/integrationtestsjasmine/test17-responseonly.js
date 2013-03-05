
var oldResponse = jsf.ajax.response;
//we are going to decorate the response for the first testcase
function applySourceOnly() {

    var newResponse = function (request, context) {
        var newContext = {};
        newContext.source = context.source;
        newContext.onevent = context.onevent;
        newContext.onerror = context.onerror;

        oldResponse(request, newContext);
    }
    jsf.ajax.response = newResponse;
};
function resetResponse() {
    jsf.ajax.response = oldResponse;
}
function applyEmpty() {

    var newResponse = function (request, context) {
        var newContext = {};

        newContext.onevent = context.onevent;
        newContext.onerror = context.onerror;

        oldResponse(request, newContext);
    }
    jsf.ajax.response = newResponse;
}

afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test18-eventlocations.jsf");
    }, 1000);
});
describe("Various response tests giving the codebase something to chew on in the reponse part", function () {
    beforeEach(function () {
        myfaces.testcases.ajaxCnt = 0;
    });
    it("handles a normal reset case", function () {
        runs(function () {
            jsf.ajax.request('resetme', null, {
                execute: '@this',
                render: 'myVal',
                'javax.faces.behavior.event': 'action'
            });
            waitsFor(function () {
                return !!myfaces.testcases.ajaxCnt;
            });
        });
    });
    it("minimalistic context, source id is given", function () {
        runs(function () {
            applySourceOnly();
            jsf.ajax.request('idgiven', null, {
                execute: '@this',
                render: 'myVal',
                'javax.faces.behavior.event': 'action'
            });
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        });
        runs(function () {
            expect($("#myVal").html().indexOf("1") != -1).toBeTruthy(); //"innerHTML of result must be 1",
        });
    });
    it("runs on an empty context map", function () {
        runs(function () {
            applyEmpty();
            jsf.ajax.request('emptymap', null, {
                execute: '@none',
                render: 'outputWriter',
                'javax.faces.behavior.event': 'action'
            });
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        });
        runs(function () {
            expect($("#myVal").html().indexOf("1") != -1).toBeTruthy(); //"innerHTML of result must be 1",
        });
    });
});