var TestCase = myfaces._supportive.unittest.TestCase;
var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;
var AjaxErrorCase = myfaces._supportive.unittest.JSFAjaxErrorTestCase;
var target = "./test.mockup";

var testGroup = new (_class("ExecuteGroup", myfaces._supportive.unittest.TestGroup,
{
    _description:"Test for a none in the execute part of jsf.js",
    constructor_: function() {
        this._callSuper("constructor_");
    },

    postcondition: function() {
        //if the tests have passed forward to the next testing page
        return true;
    },
    tearDown: function() {
        this._callSuper("tearDown");
        this.autoForward("./test19-windowid.jsf");
    }
}))();


testGroup.emitPPR = function(ajaxFunc, source, event, action, useIframe, formName) {
    document.getElementById(formName || "form1").action = target;

    // if (arguments.length <= 4) {
    ajaxFunc(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {
        op:action
    });

};


testGroup.addCase(
    new AjaxCase({
        description: "Emit ppr with @none",
        globalProcess: false,

        run: function() {
            document.getElementById("centerForm").action = target;
            this.ajaxRequest(document.getElementById("submitme"), null, {
                render: "booga @none",
                execute:"booga2 @none",
                op:     "executeNone"
            });
        },

        postcondition: function() {
            this.assertTrue("All field must contain successful", document.getElementById("result").innerHTML.indexOf("success") != -1);
        }
    }));

setTimeout(function() {
    testGroup.start();
}, 100);
