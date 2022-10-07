var req,resp, viest;

beforeEach(function () {


    let oldReq = faces.ajax.request;
    faces.ajax.request = function(element, event, options) {
        try {
            req = true;
            oldReq(element, event, options);
        } finally {
            faces.ajax.request = oldReq;
        }
    }
    let oldResp = faces.ajax.response;
    faces.ajax.response = (request, context) => {
        try {
            resp = true;
            oldResp(request, context);
        } finally {
            faces.ajax.response = oldResp;
        }
    };
    let oldViewst = faces.getViewState;
    faces.getViewState = (formElement) => {
        try {
            viest = true;
            oldViewst(formElement);
        } finally {
            faces.getViewState = oldViewst;
        }
    };
});
afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test13-cssreplacementhead.jsf");
    }, 1000);
});
describe("Test for decoratable calls within our jsf lifecycle", function () {
    it("checks whether all functions are properly called", function (done) {
        jsfAjaxRequestPromise('reloader', null, {
            execute: '@none',
            render: 'outputWriter',
            'jakarta.faces.behavior.event': 'action'
        }).then(function (success) {
            setTimeout(function () {
                expect(req).toEqual(true);
                expect(resp).toEqual(true);
                expect(viest).toEqual(true);
                done();
            }, 500);
        }).catch(function () {
            expect(req).toEqual(true);
            expect(resp).toEqual(true);
            expect(viest).toEqual(true);
            done();
        });
    });
});