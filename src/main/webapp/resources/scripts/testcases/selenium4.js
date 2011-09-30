var TestCase = myfaces._supportive.unittest.TestCase;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"Chain Test",
            postcondition: function() {

                this.autoForward("./integrationtests/selenium5.jsf");

                return true;
            }
        });
testGroup.addCase(new TestCase({
    description:"Chain test",
    run: function() {
        jsf.util.chain(document.getElementById("chaincall"), null, testFunc1, testFunc2, testFunc3, testFunc4);
    },
    postcondition: function() {
        this.assertTrue("resulting text found", $("body").html().indexOf("test1 succeeded test2 succeededtest3 succeeded") != -1);
    }
}));

setTimeout(function() {
    testGroup.start();
}, 100);
