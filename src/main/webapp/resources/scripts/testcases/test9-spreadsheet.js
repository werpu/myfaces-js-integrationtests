var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new (_class("Test9SpreadSheet", myfaces._supportive.unittest.TestGroup,
{
    _description:"Table Test, replacement of table elements",
    constructor_: function() {
        this._callSuper("constructor_");
    },
    tearDown: function() {
        this._callSuper("tearDown");
        this.autoForward("./test10-doubleeval.jsf");

    }
}))();

testGroup.addCase(new AjaxCase({
    description:"Chain test",
    defer: 2000,
    manualTearDown: true,
    precondition: function() {
        this._ajaxCnt = 1;
        return true;
    },
    run: function() {
        for (var cnt = 0; cnt < 100; cnt++) {
            //first we set 100 values
            var currentField1 = "#testTable2\\:" + cnt + "\\:input1";
            var currentField2 = "#testTable2\\:" + cnt + "\\:input2";
            var currentOutput2 = "testTable2:" + cnt + ":field1";
            var currentOutput1 = "testTable2:" + cnt + ":field2";
            var origin = "testTable2:" + cnt + ":submitall";

            $(currentField1).val("value1:" + cnt);
            $(currentField2).val("value2:" + cnt);
            //secondly we issue 100 requests
            currentField2 = currentField2.replace("#", "").replace(/\\/g, "");
            currentField1 = currentField1.replace("#", "").replace(/\\/g, "");

            this.ajaxRequest(origin, null, {
                execute:currentField2 + " " + currentField1,
                render:currentOutput1 + " " + currentOutput2,
                'javax.faces.behavior.event':'action'
            });
        }
    },

    postcondition: function() {

        if (this._ajaxCnt == 100) {//last request
            try {

                for (var cnt = 0; cnt < 100; cnt++) {
                    var currentOutput1 = "#testTable2\\:" + cnt + "\\:field1";
                    var currentOutput2 = "#testTable2\\:" + cnt + "\\:field2";

                    var assert1 = $(currentOutput1).html().indexOf("value1:" + cnt) != -1;
                    var assert2 = $(currentOutput2).html().indexOf("value2:" + cnt) != -1;

                    this.assertTrue("Field " + cnt + " has ajax content", assert1 && assert2);
                    if (this.attr("failed")) {
                        return false;
                    }
                }

            } finally {
                this.endCase();
                this.tearDown();
            }
        }
        this._ajaxCnt++;
        return true;
    }
}));

setTimeout(function() {
    testGroup.start();
}, 1000);
