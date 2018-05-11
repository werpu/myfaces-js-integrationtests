/*
 * jsf jasmine connection
 */

var myfaces = window.myfaces || {};
myfaces.testcases = myfaces.testcases || {};
//marks the current ajax request cycle to be finished


myfaces.testcases.ajaxCnt = 0;
myfaces.testcases.ajaxRequest = jsf.ajax.request;
myfaces.testcases.ajaxEvent = null;
myfaces.testcases.ajaxEvents = {};


jsf.ajax.request = function (source, evt, options) {
    myfaces.testcases.ajaxEvents = {};
    myfaces.testcases.ajaxRequest(source, evt, options);
};

jsf.ajax.addOnEvent(function (evt) {
    myfaces.testcases.ajaxEvent = evt;
    myfaces.testcases.ajaxEvents[evt.status] = true;
    if (evt.status === "success") {
        myfaces.testcases.ajaxCnt ++;
    }
});

jsf.ajax.addOnError(function (evt) {
    myfaces.testcases.ajaxEvent = evt;
    myfaces.testcases.ajaxEvents["error"] = true;
    myfaces.testcases.ajaxCnt ++;
});

/**
 * helper function be be moved out in the long run
 * TODO namespace this
 */
emitPPR = function (source, event, action, formName) {
    document.getElementById(formName || "form1").action = target;
    return jsfAjaxRequestPromise(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {
        op: action
    });
};

myfaces.testcases.redirect = function (href) {
    if (window.location.href.indexOf("autoTest=true") != -1) {
        window.location.href = href + "?autoTest=true";
    }
};


window.jsfAjaxRequestPromise = function(element, event, options) {
    return new Promise(function(resolve, reject) {
        var finalArgs = [];
        finalArgs.push(element);
        finalArgs.push(event);
        if (options) {
            finalArgs.push(options);
        } else {
            finalArgs.push({});
        }
        var oldOnError = finalArgs[2]["onerror"];
        finalArgs[2]["onerror"] = function (evt) {
            reject();
            if (oldOnError) {
                oldOnError(evt);
            }
        };
        var oldOnEvent = finalArgs[2]["onevent"];
        finalArgs[2]["onevent"] = function (evt) {
            if (evt.status.toLowerCase() === "success")
                resolve(evt);
            if (oldOnEvent) {
                oldOnEvent(evt);
            }
        };


        jsf.ajax.request.apply(jsf.ajax.request, finalArgs)
    });
};