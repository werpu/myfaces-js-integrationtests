var TestCase = myfaces._supportive.unittest.TestCase;
var testGroup = new (_class("SeleniumGroup2", myfaces._supportive.unittest.TestGroup, {
    _description:"Full Body Replacement",

    constructor_:function () {
        this._callSuper("constructor_");
    },

    setup:function () {
        this._callSuper("setup");

    },
    postcondition:function () {
        this._callSuper("postcondition");
        return true;
    },
    tearDown:function () {
        this._callSuper("tearDown");
        this.autoForward("./windowid2.jsf?booga=bla&windowId=10");
    }

}))();

//testGroup.addStandardTestcase("Full Body Replacement normal", "form1", "body", function () {
//    this.assertTrue("Body replacement and script eval performed", $("#scriptreceiver").html().indexOf("hello from embedded script") != -1);
//});

testGroup.addCase(new (_class("Case1", TestCase, {
    _description:"Test for windowid",
    _globalProcess:false,

    constructor_:function () {
        this._callSuper("constructor_");
    },

    run:function () {

    },
    postcondition:function () {
        this._callSuper("postcondition");

        try {
            var dom = myfaces._impl._util._Dom;

            var result = dom.getWindowId();
            this.assertTrue("Result should be 10", parseInt(result) == 10);


            var result = dom.getWindowId(document.getElementById("outerContainer"));
            this.assertTrue("Result should be 10", parseInt(result) == 10);

            var dom = myfaces._impl._util._Dom;
            var result = dom.getWindowId(document.getElementById("centerForm"));
            this.assertTrue("Result should be 10", parseInt(result) == 10);

            var dom = myfaces._impl._util._Dom;
            var result = dom.getWindowId(document.getElementById("centerForm2"));
            this.assertTrue("Result should be 10", parseInt(result) == 10);

            /*var dom = myfaces._impl._util._Dom;
            var result = dom.getWindowId(document.getElementById("booga"));
            this.assertTrue("Result should be 10", parseInt(result) == 10);

            var dom = myfaces._impl._util._Dom;
            var result = dom.getWindowId(document.getElementById("booga2"));
            this.assertTrue("Result should be 10", parseInt(result) == 10);
             */
            return true;
        } catch (e) {
            this.fail("Error thrown");
        }
        return true;
    },

    tearDown:function () {
        document.getElementById("booga2").value = document.getElementById("booga").value;
        this._callSuper("tearDown");
    }
}))());

testGroup.addCase(new (_class("Case2", TestCase, {
    _description:"Test for double form error",
    _globalProcess:false,

    constructor_:function () {
        this._callSuper("constructor_");
    },
    run:function () {
    },
    postcondition:function () {
        this._callSuper("postcondition");

        document.getElementById("booga2").value = "11";

        try {
            var dom = myfaces._impl._util._Dom;
            var result = dom.getWindowId(document.getElementById("outerContainer"));
            this.fail("window id should have thrown an error");
            return false;
        } catch (e) {
            this.assertTrue("windowid has thrown an error legally", true);
        }
        return true;
    },

    tearDown:function () {
        document.getElementById("booga2").value = document.getElementById("booga").value;
        this._callSuper("tearDown");
    }
}))());

setTimeout(function () {
    testGroup.start();
}, 100);
