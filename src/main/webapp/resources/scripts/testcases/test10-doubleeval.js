var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"Double Eval Detection",
            postcondition: function() {

                this.autoForward("./test11-scriptblocks.jsf")
                return true;
            }
        });

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
