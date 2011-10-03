var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"Script blocks in various formats",
            postcondition: function() {
                this.autoForward("./test12-apidecoration.jsf");
                return true;
            }
        });

testGroup.addCase(new AjaxCase({
    description:"Script Block Test",
    /*we enable global processing to handle a triggered click on the issuing control*/
    _ajaxCnt: 0,
    setup: function() {
        $("#resultArea").html("");
    },

    run: function() {
        this.ajaxRequest('reloader', null, {execute:'@none',render:'outputWriter','javax.faces.behavior.event':'action'});
    },

    postcondition: function() {
        var renderTargetHTML = $("#resultArea").html();
        //this.assertTrue("result area text must be correct", renderTargetHTML == "Results: <br>normal script<br>normal script --&gt;<br>normal script --&gt;<br>normal script ]]&gt;<br>");
        this.assertTrue("contents of result2 must match", $(".result2").html() == "normal script --&gt;");
        this.assertTrue("contents of result3 must match", $(".result3").html() == "normal script --&gt;");
        //normal script ]]&gt;
        this.assertTrue("contents of result4 must match", $(".result4").html() == "normal script ]]&gt;");

        return true;
    }
}))
        ;
setTimeout(function() {
    testGroup.start();
}, 100);