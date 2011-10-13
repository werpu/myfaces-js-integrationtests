var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;
var testGroup = new (_class("SeleniumGroup2", myfaces._supportive.unittest.TestGroup, {
    _description:"Full Body Replacement",

    constructor_: function() {
      this._callSuper("constructor_");
    },
    setup: function() {
        this._callSuper("setup");
    },
    postcondition: function() {
        this._callSuper("postcondition");
        return true;
    },
    tearDown: function() {
        this._callSuper("tearDown");
        this.autoForward("./test4-chain.jsf");
    },
    emitPPR: function(ajaxFunc, source, event, action, useIframe, formName) {
        document.getElementById(formName || "form1").action = target;

        if (arguments.length <= 4) {
            ajaxFunc(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {op:action});
        } else {
            ajaxFunc(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {op:action, myfaces: {transportType:"multipartQueuedPost"}});
        }
    },
    addStandardTestcase: function(description, origin, command, postCondition) {
        this.addCase(new AjaxCase({
            description: description,
            globalProcess: false,
            run: function() {
                this.attr("testGroup").emitPPR(this.ajaxRequest, origin, null, command);
            },
            postcondition: postCondition
        }));
    }
}))();

testGroup.addStandardTestcase("Full Body Replacement normal","form1","body2", function() {
    this.assertTrue("Check for elements", $("body").html().indexOf("testResults59") != -1);
    this.assertTrue("Body replacement and script eval performed", $("body").html().indexOf("Body replacement test successful") != -1);
});

setTimeout(function() {
    testGroup.start();
}, 100);
