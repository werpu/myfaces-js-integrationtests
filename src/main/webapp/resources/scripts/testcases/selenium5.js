var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"Chain Test",
            tearDown: function() {
                this.autoForward("./integrationtests/selenium6.jsf");

            }
        });
testGroup.addCase(new AjaxCase({
    description:"Chain test",
    defer: 2000,
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
