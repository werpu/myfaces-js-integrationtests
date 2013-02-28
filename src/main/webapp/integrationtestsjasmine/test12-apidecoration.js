var functionCalled = {};
/*small aop decoration for a given namespaced function, TODO replace this with jasmine inspector*/
function applyNms(nms, func) {
    nms = nms.split(/\./);
    var currNms = window;
    for(var cnt = 0; cnt < nms.length-1; cnt++) {
        currNms = currNms[nms[cnt]];
        if(cnt == nms.length-2) {
            currNms[nms[nms.length-1]] = func;
        }
    }
}

function decorate(namespace, func) {
    applyNms(namespace, function (/*arguments*/) {
        functionCalled[namespace] = true;
        return func.apply(func, arguments);
    });
}

beforeEach(function () {
    decorate("jsf.ajax.request", jsf.ajax.request);
    decorate("jsf.ajax.response", jsf.ajax.response);
    decorate("jsf.getViewState", jsf.getViewState);
});
afterEach(function () {
    myfaces.testcases.redirect("./finalResults.jsf");
});
describe("Test for calls within our jsf lifecycle", function () {
    it("does the decoration work for the jsf lifecycle for all functions which are called", function () {
        runs(function () {
            jsf.ajax.request('reloader', null, {
                execute: '@none',
                render: 'outputWriter',
                'javax.faces.behavior.event': 'action'
            });
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        }, "timeout", 10000);
        runs(function () {
            expect(!!functionCalled["jsf.ajax.request"]).toBeTruthy();
            expect(!!functionCalled["jsf.ajax.response"]).toBeTruthy();
            expect(!!functionCalled["jsf.getViewState"]).toBeTruthy();
        });
    });
});


