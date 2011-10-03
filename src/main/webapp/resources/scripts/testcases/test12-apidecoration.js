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
var decorate = function( /*String*/ namespace, /*function*/ toDecorate) {
    RT.applyToGlobalNamespace(namespace, Lang.hitch(this, function() {
        this.functionCalled[namespace] = true;
        toDecorate.apply(toDecorate, arguments);
    }));
};

testGroup.addCase(new AjaxCase({
    description:"Script Block Test",
    /*we enable global processing to handle a triggered click on the issuing control*/
    _ajaxCnt: 0,
    functionCalled: null,

    setup: function() {
        decorate("jsf.ajax.request", jsf.ajax.request);
        decorate("jsf.ajax.response", jsf.ajax.response);
        decorate("jsf.getViewState", jsf.ajax.response);
        decorate("jsf.util.chain", jsf.util.chain);
    },

    run: function() {
        this.ajaxRequest('reloader', null, {execute:'@none',render:'outputWriter','javax.faces.behavior.event':'action'});
    },

    postcondition: function() {
        this.assertTrue("request decorated and called", !!this["jsf.ajax.request"]);
        this.assertTrue("response decorated and called", !!this["jsf.ajax.response"]);
        this.assertTrue("getViewState decorated and called", !!this["jsf.getViewState"]);
        this.assertTrue("chain decorated and called", !!this["jsf.util.chain"]);

        return true;
    }
}))
        ;
setTimeout(function() {
    testGroup.start();
}, 100);