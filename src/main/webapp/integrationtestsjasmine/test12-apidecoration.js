beforeEach(function () {
    spyOn(jsf.ajax,"request").andCallThrough();
    spyOn(jsf.ajax,"response").andCallThrough();
    spyOn(jsf,"getViewState").andCallThrough();
});
afterEach(function () {
    myfaces.testcases.redirect("./test13-cssreplacementhead.jsf");
});
describe("Test for decoratable calls within our jsf lifecycle", function () {
    it("checks whether all functions are properly called", function () {
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
            expect(jsf.ajax.request).toHaveBeenCalled();
            expect(jsf.ajax.response).toHaveBeenCalled();
            expect(jsf.getViewState).toHaveBeenCalled();
        });
    });
});