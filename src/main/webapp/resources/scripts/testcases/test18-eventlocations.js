var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var oldResponse = jsf.ajax.response;

function resetResponse() {
    jsf.ajax.response = oldResponse;
}

var testGroup = new (_class("Test 18 Event Locations", myfaces._supportive.unittest.TestGroup, {
    _description:"Response only Test",
    constructor_:function () {
        this._callSuper("constructor_");
    },
    tearDown:function () {
        this._callSuper("tearDown");
        this.autoForward("./finalResults.jsf")
    }
}))();

testGroup.addCase(new AjaxCase({
    description:"Test1, source id is given",
    /*we enable global processing to handle a triggered click on the issuing control*/
    _successCalled:false,

    precondition:function () {
        //we are going to decorate the response for the first testcase
        var _t = this;
        var _applySourceOnly = function () {
            var newResponse = function (request, context) {
                var newContext = {};
                newContext.source = context.source;
                newContext.onevent = function (evt) {
                    if (evt.status == "success") {
                        _t._successCalled = true;
                    }
                    context.onevent(evt);
                };

                _t.assertFalse("success not called before resonse", _t._successCalled);
                oldResponse(request, newContext);
                _t.assertTrue("success called after resonse", _t._successCalled);
            };
            jsf.ajax.response = newResponse;
        };
        _applySourceOnly();
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
        //condition check already in the response handler done
        return true;
    }

}));

setTimeout(function () {
    testGroup.start();
}, 100);

