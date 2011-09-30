var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"Partial Page Rendering Nav Case",
            postcondition: function() {
                this.autoForward("./integrationtests/tableTest.jsf");
                return true;
            }
        });
testGroup.addCase(new AjaxCase({
    description:"Chain test",
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
