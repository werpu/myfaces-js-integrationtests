var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new (_class("Test8NavCase1", myfaces._supportive.unittest.TestGroup,
        {
            _description:"Partial Page Rendering Nav Case",
            constructor_: function() {
                this._callSuper("constructor_");
            },
            tearDown: function() {
                this._callSuper("tearDown");
                this.autoForward("./test9-spreadsheet.jsf");

            }
        }))();

testGroup.addCase(new AjaxCase({
    description:"Nav Case Test",
    defer: 2000,
    precondition: function() {
        $("#firstName").val("Werner");
        $("#lastName").val("Tester");
        $("#city").val("Linz");
        $("#zip").val("Tester");
        return true;
    },
    run: function() {
        //jsf.util.chain(document.getElementById('forward'), event,'jsf.ajax.request(\'forward\',event,{execute:\'mainForm\',render:\'fullContent\',\'javax.faces.behavior.event\':\'action\'})'); return false;

        this.ajaxRequest('forward', null, {execute:'mainForm',render:'fullContent','javax.faces.behavior.event':'action'});
    },
    postcondition: function() {
        this.assertTrue("FirstName transferred", $("span#firstName").html().indexOf("Werner") != -1);
        this.assertTrue("LastName transferred", $("span#lastName").html().indexOf("Tester") != -1);
        this.assertTrue("Script Executed", $("body").html().indexOf("script executed") != -1);
    }
}));

setTimeout(function() {
    testGroup.start();
}, 1000);
