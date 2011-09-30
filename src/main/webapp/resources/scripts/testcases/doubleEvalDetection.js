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
