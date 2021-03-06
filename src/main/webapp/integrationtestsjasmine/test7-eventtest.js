;var localEvents = [];
var globalEvents = [];
var DEFAULT_EVENTTYPES = {
    "begin": true,
    "complete": true,
    "success": true
};

function cloneEvent(evt) {
    var data = {};
    data.status = evt.status;
    data.source = evt.source;
    data.responseText = evt.responseText;
    data.responseXML = evt.responseXML;
    data.type = evt.type;
    return data;
}

function localEventHandler(data) {
    localEvents.push(cloneEvent(data));
}

function globalEventHandler(data) {
    globalEvents.push(cloneEvent(data))
}

function expectations(expectFunc, data) {
    expectFunc(data.type == "event").toBeTruthy();
    expectFunc(!!data.status).toBeTruthy();
    expectFunc(DEFAULT_EVENTTYPES[data.status]).toBeTruthy();
    expectFunc(!!data.source).toBeTruthy();
    expectFunc(!!data.source.id).toBeTruthy();
}

afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test8-navcase1.jsf");
    }, 1000);
});
describe("Event handler phases test", function () {
    beforeEach(function () {
        myfaces.testcases.ajaxCnt = 0;
        localEvents = [];
        globalEvents = [];
    });
    it("Checks the local events", function () {
        runs(function () {
            jsf.ajax.request(document.getElementById("updateTrigger"), null, {
                render: "updatePanel",
                execute: "updatePanel updateTrigger",
                onevent: localEventHandler
            });
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        }, "timeout", 10000);
        runs(function () {
            expect(localEvents.length).toBe(3);
            for (var pos = 0; pos < localEvents.length; pos++) {
                expectations(expect, localEvents[pos]);
            }
        });
    });

    it("Checks the global events", function () {
        runs(function () {
            jsf.ajax.addOnEvent(globalEventHandler);
            jsf.ajax.request(document.getElementById("updateTrigger"), null, {
                render: "updatePanel",
                execute: "updatePanel updateTrigger"
            });
        });
        waitsFor(function () {
            return !!myfaces.testcases.ajaxCnt;
        }, "timeout", 10000);
        runs(function () {
            expect(globalEvents.length).toBe(3);
            for (var pos = 0; pos < globalEvents.length; pos++) {
                expectations(expect, globalEvents[pos]);
            }
        });
    });
});
