var TestCase = myfaces._supportive.unittest.TestCase;

var testGroup = new (_class("TestGroup4", myfaces._supportive.unittest.TestGroup,
        {
            _description:"Chain Test",
            constructor_: function() {
                this._callSuper("constructor_");
            },

            postcondition: function() {
                return true;
            },

            tearDown: function() {
                this._callSuper("tearDown");
                this.autoForward("./test5-viewroot2.jsf");
            }
        }))();
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
