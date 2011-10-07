var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"Chain Test",
            tearDown: function() {
                this._statisticsEngine.endTestGroup(this._description);
                this.autoForward("./test6-tablebasic.jsf");

            }
        });
testGroup.addCase(new AjaxCase({
    description:"Chain test",
    defer: 3000,
    run: function() {
        this.ajaxRequest("allKeyword", null, {render:"@all", execute:"@all"});
    },
    postcondition: function() {
        this.assertTrue("resulting text found", $("body").html().indexOf("refresh successul2") != -1);
    }
}));

setTimeout(function() {
    testGroup.start();
}, 1000);
