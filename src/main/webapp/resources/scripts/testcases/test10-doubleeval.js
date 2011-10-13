var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new (_class("Test10DoubleEval", myfaces._supportive.unittest.TestGroup,
        {
            _description:"Double Eval Detection",
            constructor_: function() {
                this._callSuper("constructor_");
            },
            tearDown: function() {
                this._callSuper("tearDown");
                this.autoForward("./test11-scriptblocks.jsf")
            }
        }))();

testGroup.addCase(new AjaxCase({
    description:"Chain test",
    defer: 2000,
    /*we enable global processing to handle a triggered click on the issuing control*/

    manualTearDown: true,
    _ajaxCnt: 0,
    precondition: function() {
        this._ajaxCnt = 1;
        return true;
    },
    run: function() {
        this.ajaxRequest('reloader', null, {execute:'@none',render:'outputWriter','javax.faces.behavior.event':'action'});
        this.ajaxRequest('reloader', null, {execute:'@none',render:'outputWriter','javax.faces.behavior.event':'action'});
    },
    postcondition: function() {
        if (this._ajaxCnt == 2) {
            try {
                var renderTargetHTML = $("#output").html();
                this.assertTrue("render target only is allowed to have 2 entries", renderTargetHTML == "0 1 2 ");
            } finally {
                this.tearDown();
            }
        }
        this._ajaxCnt++;
        return true;
    }
}));
setTimeout(function() {
    testGroup.start();
}, 100);
