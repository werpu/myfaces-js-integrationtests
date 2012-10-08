var TestCase = myfaces._supportive.unittest.TestCase;
var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;
var AjaxErrorCase = myfaces._supportive.unittest.JSFAjaxErrorTestCase;
var target = "./test.mockup";

var testGroup = new (_class("SeparatorGroup", myfaces._supportive.unittest.TestGroup,
        {
            _description:"Testing for a Separator char",
            constructor_:function () {
                this._callSuper("constructor_");
            },

            postcondition:function () {
                //if the tests have passed forward to the next testing page
                return true;
            },
            tearDown:function () {
                this._callSuper("tearDown");
                this.autoForward("./test22-separator.jsf");
            }
        }))();

testGroup.addCase(new TestCase({
    description:"Test for a default component separator char",
    run:function () {
        this._separatorChar = jsf.separatorchar;
    },
    postcondition:function () {
        this.assertTrue("WindowId found", this._separatorChar == ":");
    }
}));

setTimeout(function() {
    testGroup.start();
}, 100);