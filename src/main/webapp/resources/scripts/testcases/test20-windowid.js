var TestCase = myfaces._supportive.unittest.TestCase;
var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;
var AjaxErrorCase = myfaces._supportive.unittest.JSFAjaxErrorTestCase;
var target = "./test.mockup";

var testGroup = new (_class("WindowIdGroup", myfaces._supportive.unittest.TestGroup,
        {
            _description:"MyFaces jsf.js windowId test 2 testing for url param behavior",
            constructor_:function () {
                this._callSuper("constructor_");
            },

            postcondition:function () {
                //if the tests have passed forward to the next testing page
                return true;
            },
            tearDown:function () {
                this._callSuper("tearDown");

                this.autoForward("./test21-separator.jsf");
            }
        }))();

var target = "./test.mockup";
/**
 * ppr emitting function
 */
testGroup.emitPPR = function(ajaxFunc, source, event, action, formName) {
    document.getElementById(formName || "centerForm").action = target;
    ajaxFunc(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {
        op:action
    });
};

testGroup.addCase(new TestCase({
    description:"Test for a valid window id for a given form",
    run:function () {
        this._windowId = jsf.getClientWindow(document.getElementById("centerForm"));

    },
    postcondition:function () {
        this.assertTrue("WindowId found", this._windowId != null);
    }
}));

testGroup.addCase(new TestCase({
    description:"Test for a valid window id given a url windowid",
    run:function () {
        this._windowId = jsf.getClientWindow(document.getElementById("form2"));

    },
    postcondition:function () {
        this.assertTrue("WindowId found", this._windowId == "booga2");
    }
}));


testGroup.addCase(new AjaxCase({
    description:"Test for a WindowId being sent down the ajax cycle",
    run:function () {
        this.attr("testGroup").emitPPR(this.ajaxRequest, document.getElementById("input1"), null, 'windowId', 'centerForm');
    },
    postcondition:function () {
        this.assertTrue("Message must indicate that the ajax cycle is not  down", document.getElementById("result").innerHTML == "Window Id is sent");
    }
}));

testGroup.addCase(new AjaxCase({
    description:"Test for the  WindowId not being sent down the ajax cycle",
    run:function () {
        this.attr("testGroup").emitPPR(this.ajaxRequest,document.getElementById("input2"), null, 'windowId', 'form2');
    },
    postcondition:function () {
        this.assertTrue("WindowId is not sent down the ajax request", document.getElementById("result").innerHTML == "Window Id is sent");
    }
}));

setTimeout(function () {
    testGroup.start();
}, 100);