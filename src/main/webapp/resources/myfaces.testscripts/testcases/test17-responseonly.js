var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

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
}
;
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

var testGroup = new (_class("Test17ResponseOnly", myfaces._supportive.unittest.TestGroup, {
    _description:"Response only Test",
    constructor_:function () {
        this._callSuper("constructor_");
    },
    tearDown:function () {
        this._callSuper("tearDown");
        this.autoForward("./test18-eventlocations.jsf")
    }
}))();

testGroup.addCase(new AjaxCase({
    description:"Resetting testcases",
    /*we enable global processing to handle a triggered click on the issuing control*/

    run:function () {
        this.ajaxRequest('resetme', null, {
            execute:'@this', 
            render:'myVal', 
            'javax.faces.behavior.event':'action'
        });
    }

}));

testGroup.addCase(new AjaxCase({
    description:"Test1, source id is",
    /*we enable global processing to handle a triggered click on the issuing control*/

    precondition:function () {
        applySourceOnly();
        return true;
    },
    run:function () {
        this.ajaxRequest('idgiven', null, {
            execute:'@this', 
            render:'myVal', 
            'javax.faces.behavior.event':'action'
        });
    },
    postcondition:function () {
        this.assertTrue("innerHTML of result must be 1", $("#myVal").html().indexOf("1") != -1);
        //resetResponse();
        return true;
    }

}));

testGroup.addCase(new AjaxCase({
    description:"Test2, context is an empty map",
    /*we enable global processing to handle a triggered click on the issuing control*/

    precondition:function () {
        applyEmpty();
        return true;
    },
    run:function () {
        //var evt = {};
        //evt.type = "click";
        this.ajaxRequest('emptymap', null, {
            execute:'@none',
            render:'outputWriter',
            'javax.faces.behavior.event':'action'
        });
    },
    postcondition:function () {
        this.assertTrue("innerHTML of result must be 1", $("#myVal").html().indexOf("1") != -1);
        //resetResponse();
        return true;
    }
}));

setTimeout(function () {
    testGroup.start();
}, 100);

