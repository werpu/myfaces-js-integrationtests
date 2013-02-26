/*
 * jsf jasmine connection
 */

var myfaces = window.myfaces || {};
myfaces.testcases = myfaces.testcases || {};
//marks the current ajax request cycle to be finished
myfaces.testcases.ajaxFinished = true;
myfaces.testcases.ajaxRequest = jsf.ajax.request;
myfaces.testcases.ajaxEvent = null;
myfaces.testcases.ajaxEvents = {};

jsf.ajax.request = function (source, evt, options) {
    myfaces.testcases.ajaxFinished = false;
    myfaces.testcases.ajaxEvents = {};
    myfaces.testcases.ajaxRequest(source, evt, options);
};

jsf.ajax.addOnEvent(function (evt) {
    myfaces.testcases.ajaxEvent = evt;
    myfaces.testcases.ajaxEvents[evt.status] = true;
    if (evt.status === "success") {
        myfaces.testcases.ajaxFinished = true;
    }
});

jsf.ajax.addOnError(function (evt) {
    myfaces.testcases.ajaxEvent = evt;
    myfaces.testcases.ajaxFinished = true;
    myfaces.testcases.ajaxEvents["error"] = true;
});

/**
 * helper function be be moved out in the long run
 * TODO namespace this
 */
emitPPR = function (source, event, action, formName) {
    document.getElementById(formName || "form1").action = target;
    jsf.ajax.request(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {
        op: action
    });
};

myfaces.testcases.forward = function (href) {
    if (window.location.href.indexOf("autoTest=true") != -1) {
        window.location.href = href + "?autoTest=true";
    }
}