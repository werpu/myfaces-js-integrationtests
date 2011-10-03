var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;
var RT = myfaces._impl.core._Runtime;
var Lang = myfaces._impl._util._Lang;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"Testing for decorated api calls",
            postcondition: function() {
                //this.autoForward("./test11-scriptblocks.jsf");
                return true;
            }
        });
var  functionCalled = {};

var decorate = function( /*String*/ namespace, /*function*/ toDecorate) {
    RT.reserveNamespace(namespace, toDecorate);

    RT.applyToGlobalNamespace(namespace, Lang.hitch(this, function() {
        functionCalled[namespace] = true;
        return toDecorate.apply(toDecorate, arguments);
    }));
};



testGroup.addCase(new AjaxCase({
    description:"Script Block Test",
    /*we enable global processing to handle a triggered click on the issuing control*/
    _ajaxCnt: 0,


    setup: function() {
        decorate("jsf.ajax.request", jsf.ajax.request);
        decorate("jsf.ajax.response", jsf.ajax.response);
        decorate("jsf.getViewState", jsf.getViewState);
        decorate("jsf.util.chain", jsf.util.chain);

    },

    run: function() {
        this.ajaxRequest('reloader', null, {execute:'@none',render:'outputWriter','javax.faces.behavior.event':'action'});
        //document.getElementById("reloader").
    },

    postcondition: function() {
        this.assertTrue("request decorated and called", !!functionCalled["jsf.ajax.request"]);
        this.assertTrue("response decorated and called", !!functionCalled["jsf.ajax.response"]);
        this.assertTrue("getViewState decorated and called", !!functionCalled["jsf.getViewState"]);
        this.assertTrue("chain decorated and called", !!functionCalled["jsf.util.chain"]);

        return true;
    }
}))
        ;
setTimeout(function() {
    testGroup.start();
}, 100);