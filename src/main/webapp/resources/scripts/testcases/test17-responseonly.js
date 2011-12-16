var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var oldResponse = jsf.ajax.response;
//we are going to decorate the response for the first testcase
function applySourceOnly() {

    var newResponse = function (request, context) {
        var newContext = {};
        newContext.source = context.source;
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
        oldResponse(request, newContext);
    }
    jsf.ajax.response = newResponse;
}

var submitMe = function (evt) {
    applySourceOnly();
    jsf.ajax.request(document.getElementById("blabla"), evt, {execute:"blabla", render:"testForm"});

}
var submitEmpty = function (evt) {
    applyEmpty();
    jsf.ajax.request(document.getElementById("blabla"), evt, {execute:"blabla", render:"testForm"});
}

var testGroup = new (_class("Test17ResponseOnly", myfaces._supportive.unittest.TestGroup, {
    _description:"Response only test2",
    constructor_:function () {
        this._callSuper("constructor_");
    },

    tearDown:function () {
        this._callSuper("tearDown");
        //this.autoForward("./test10-doubleeval.jsf");

    }
}))();

//TODO add two testcases, the first one resets the input and then
//simulates a click on the first link
//The second one again resets and simularts a link into the second href
//the result of both should be a 1 in the result area
testGroup.addCase(new AjaxCase({
    description:"Test1, source id is set",
    /*we enable global processing to handle a triggered click on the issuing control*/

    precondition:function () {
        $("#resultArea").html("");
        return true;
    },
    run:function () {
        var evt = {};
        evt.type = "click";
        //this.ajaxRequest('reloader', null, {execute:'@none',render:'outputWriter','javax.faces.behavior.event':'action'});
    }
}));

testGroup.addCase(new AjaxCase({
    description:"Resetting testcases",
    /*we enable global processing to handle a triggered click on the issuing control*/

    precondition:function () {

        return true;
    },
    run:function () {
        this.ajaxRequest('resetme', null, {execute:'@this', render:'myVal', 'javax.faces.behavior.event':'action'});
    },
    postCondition:function () {
        return true;
    }
}));

testGroup.addCase(new AjaxCase({
    description:"Test1, source id is",
    /*we enable global processing to handle a triggered click on the issuing control*/

    precondition:function () {
        return true;
    },
    run:function () {
        this.ajaxRequest('idgiven', null, {execute:'@this', render:'myVal', 'javax.faces.behavior.event':'action'});
    },
    postCondition:function () {
        this.assertTrue("innerHTML of result must be 1", $("#myVal").innerHTML.indexOf("1") != -1);
        return true;
    }

}));

testGroup.addCase(new AjaxCase({
    description:"Test3, context is an empty map",
    /*we enable global processing to handle a triggered click on the issuing control*/

    precondition:function () {
        return true;
    },
    run:function () {
        var evt = {};
        evt.type = "click";
        //this.ajaxRequest('reloader', null, {execute:'@none',render:'outputWriter','javax.faces.behavior.event':'action'});
    },
    postCondition:function () {
        this.assertTrue("innerHTML of result must be 1", $("#myVal").innerHTML.indexOf("1") != -1);
        return true;
    }
}));
