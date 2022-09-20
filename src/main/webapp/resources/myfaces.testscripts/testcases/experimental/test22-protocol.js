//preassumption jquery exists and is already loaded, we can use it as query engine


var TestCase = myfaces._supportive.unittest.TestCase;
var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;
var AjaxErrorCase = myfaces._supportive.unittest.JSFAjaxErrorTestCase;
var target = "./test.mockup";

var testGroup = new (_class("SeleniumGroup2", myfaces._supportive.unittest.TestGroup,
{
    _description:"MyFaces JSF Protocol Tests",
    constructor_: function() {
        this._callSuper("constructor_");
    },

    postcondition: function() {
        //if the tests have passed forward to the next testing page
        return true;
    },
    tearDown: function() {
        this._callSuper("tearDown");
        this.autoForward("./test2-viewroot1.jsf");
    }
}))();


testGroup.emitPPR = function(ajaxFunc, source, event, action, useIframe, formName) {
    document.getElementById(formName || "form1").action = target;

    // if (arguments.length <= 4) {
    ajaxFunc(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {
        op:action
    });
// } else {
//     ajaxFunc(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {op:action, myfaces: {transportType:"multipartQueuedPost"}});
// }
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

testGroup.addStandardTestcase("Viewstate syntax 1", "cmd_viewstate", "newviewstate",
    function() {
        var elem = document.forms[0]["javax.faces.ViewState"];
        this.assertTrue("viewstate element must have correct value", elem && elem.value.indexOf("blablabla") != -1);
    });
testGroup.addStandardTestcase("Viewstate syntax 2", "cmd_viewstate2", "newviewstate2",
    function() {
        var elem = document.forms[0]["javax.faces.ViewState"];
        this.assertTrue("viewstate element must have correct value", elem && elem.value.indexOf("blebleble2") != -1);
    });


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

        // var style = $("#attributeChange").css("border");
        // this.assertTrue("border must be set and be black", style.indexOf("black") != -1);
        $("#attributeChange").css("border", "0px solid black");
    }
    );


testGroup.addCase(new AjaxErrorCase({
    description:"Error Trigger Ajax Illegal Response",
    globalProcess: false,
    /*postcondition of the error gets the event data*/
    run: function() {
        this.attr("testGroup").emitPPR(this.ajaxRequest, "cmd_illegalresponse", null, "illegalResponse");
    },
    postcondition: function(evt) {
        this.assertTrue("Error Type must be error",evt.type === "error");
        this.assertTrue("Error status must be malformedXML", evt.status === "malformedXML")
        this.assertTrue("Response Code 200", evt.responseCode == 200)
        this.assertTrue("Response Code 200", evt.source.id == "cmd_illegalresponse")

        this.assertTrue("test failed event is coming in", !!evt )
    }
}));
/*
testGroup.addCase(new AjaxErrorCase({
    description:"Error Trigger Ajax Illegal Response IFrame",
    globalProcess: false,

    run: function() {
            this.attr("testGroup").emitPPR(this.ajaxRequest, "cmd_illegalresponse2", null, "illegalResponse");
    },
    postcondition: function(evt) {
        this.assertTrue("Error Type must be error",evt.type === "error");
        this.assertTrue("Error status must be malformedXML", evt.status === "malformedXML")
        this.assertTrue("Response Code 200", evt.responseCode == 200)
        this.assertTrue("Response Code 200", evt.source.id == "cmd_illegalresponse2")

        this.assertTrue("test failed event is coming in", !!evt )
    }
}));
*/

testGroup.addCase(new AjaxErrorCase({
    description:"Error Trigger Ajax Server Error",
    globalProcess: false,
    /*postcondition of the error gets the event data*/
    run: function() {
        this.attr("testGroup").emitPPR(this.ajaxRequest, "cmd_error", null, "errors");
    },

    _onError: function(evt) {
        //try {
        this._onErrorCalled = true;
        this.onError(evt);

    //} finally {
    //    if (!this._globalProcess && !this._manualTearDown) {
    //        this._tearDown();
    //        this.tearDown();
    //    }
    //}

    },
    onError: function(evt) {
        this._onErrorCalled = true;
    },

    onSuccess: function(evt) {
        this._onSuccessCalled = true;
    },

    postcondition: function(evt) {
        this.assertTrue("onerror and onsuccess must have been called in this case", this._onErrorCalled && this._onSuccessCalled )
    }
}));

/*testGroup.addCase(new AjaxErrorCase({
    description:"Error Trigger Ajax Server Error IFrame",
    globalProcess: false,

    run: function() {
            this.attr("testGroup").emitPPR(this.ajaxRequest, "cmd_error2", null, "errors");
    },
    postcondition: function(evt) {
        this.assertTrue("test failed event is coming in", !!evt )
    }
}));*/

setTimeout(function() {
    testGroup.start();
}, 100);

