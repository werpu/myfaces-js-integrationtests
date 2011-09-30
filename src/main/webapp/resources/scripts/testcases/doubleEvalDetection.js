var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"Double Eval Detection",
            postcondition: function() {

                //if (window.location.href.indexOf("autotest=true") != -1) {
                //    window.location.href = "/TestScripts/integrationtests/eventtest.jsf?autotest=true";
                //}
                return true;
            }
        });

testGroup.addCase(new AjaxCase({
    description:"Chain test",
    defer: 2000,
    /*we enable global processing to handle a triggered click on the issuing control*/
    globalProcess: true,
    manualTearDown: true,
    _ajaxCnt: 0,
    precondition: function() {
        this._ajaxCnt = 0;
        return true;
    },
    run: function() {
        $("#reloader").click();
        $("#reloader").click();
    },
    postcondition: function() {
        if (this._ajaxCnt == 2) {
            try {
                if (this._ajaxCnt == 99) {//last request
                    var renderTargetHTML = $("#outputWriter").html();
                    assertTrue("render target only is allowed to have 2 entries", renderTargetHTML == "0 1 2 ");
                }
            } finally {
                this.tearDown();
            }
        }
        this._ajaxCnt++;
        return true;
    }
}));