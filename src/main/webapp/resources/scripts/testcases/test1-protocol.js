//preassumption jquery exists and is already loaded, we can use it as query engine

var TestCase = myfaces._supportive.unittest.TestCase;
var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"MyFaces JSF Protocol Tests",
            postcondition: function() {
                //if the tests have passed forward to the next testing page
                this.autoForward("./test2-viewroot1.jsf");
                return true;
            }
        });

testGroup.emitPPR = function(ajaxFunc, source, event, action, useIframe, formName) {
    document.getElementById(formName || "form1").action = target;

    if (arguments.length <= 4) {
        ajaxFunc(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {op:action});
    } else {
        ajaxFunc(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {op:action, myfaces: {transportType:"multipartQueuedPost"}});
    }
};

testGroup.addStandardTestcase = function(description, origin, command, postCondition) {
    testGroup.addCase(new AjaxCase({
        description: description,
        globalProcess: false,
        run: function() {
            this.attr("testGroup").emitPPR(this.ajaxRequest, origin, null, command);
        },
        postcondition: postCondition
    }));
    //every test also has an iframe equivalent
    testGroup.addCase(new AjaxCase({
        description: description,
        globalProcess: false,
        run: function() {
            this.attr("testGroup").emitPPR(this.ajaxRequest, origin, null, command, true);
        },
        postcondition: postCondition
    }));
};

function checkForSucceed(asserter, identifier) {
    var innerText = $("#" + identifier).html();
    asserter.assertTrue(identifier + " text must be replaced", innerText.toLowerCase().indexOf("succeed") != -1);
    $("#" + identifier).html(identifier + " text reset by auto test");
}

testGroup.addStandardTestcase("Eval Ajax", "cmd_eval", "eval1",
        function() {
            checkForSucceed(this, "evalarea1");
        }
);

//obsolete, this path is a spec error and only supported by myfaces
/*testGroup.addStandardTestcase("Upadte Insert JSDOC Insert Path", "cmd_update_insert", "updateinsert1",
        function() {
            checkForSucceed(this, "evalarea2");
            checkForSucceed(this, "evalarea3");
            this.assertTrue("insert before must exist", !!$("#insertbefore").length);
            this.assertTrue("insert insertAfter must exist", !!$("#insertafter").length);
            //reset the state here as well
            $("#insertbefore").remove();
            $("#insertafter").remove();

        }
);*/

testGroup.addStandardTestcase("Update Insert Spec Insert Path", "cmd_update_insert2", "updateinsert2",
        function() {
            checkForSucceed(this, "evalarea2");
            checkForSucceed(this, "evalarea3");
            this.assertTrue("insert before must exist", !!$("#insertbefore").length);
            this.assertTrue("insert insertAfter must exist", !!$("#insertafter").length);
            //reset the state here as well
            $("#insertbefore").remove();
            $("#insertafter").remove();
        }
);

testGroup.addStandardTestcase("Delete", "cmd_delete", "delete1",
        function() {
            this.assertFalse("delete area must be gone", !!document.getElementById("deleteable"));
            if (!this.attr("failed")) {
                $("#testResults").append("<div id='deleteable'>deletearea readded by automated test</div>");
            }
        }
);

testGroup.addStandardTestcase("Attributes change", "cmd_attributeschange", "attributes",
        function() {

            var style = $("#attributeChange").css("border");
            this.assertTrue("border must be set and be black", style.indexOf("black") != -1);
            $("#attributeChange").css("border", "0px solid black");
        }
);

setTimeout(function() {
    testGroup.start();
}, 100);

