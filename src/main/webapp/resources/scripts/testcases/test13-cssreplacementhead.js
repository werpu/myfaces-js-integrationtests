var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"CSS Replacement testcase",
            postcondition: function() {
                this.autoForward("./test14-multiform.jsf");
                return true;
            }
        });
testGroup.addCase(new AjaxCase({
    description:"Nav Case Test",
    defer: 2000,
    precondition: function() {
        return true;
    },
    run: function() {
        this.ajaxRequest('nextPage', null, {execute:'mainForm',render:'@all','javax.faces.behavior.event':'action'});
    },
    postcondition: function() {
        /*this.assertFalse("div1 has no border anymore", $("#div1").css("border"));
        this.assertFalse("div2 has no border anymore", $("#div2").css("border"));
        this.assertFalse("div3 has no border anymore", $("#div3").css("border"));
        this.assertTrue("div4 has a border", $("#div4").css("border"));
        this.assertTrue("div5 has a border", $("#div5").css("border"));
        this.assertTrue("div6 has a border", $("#div6").css("border"));  */
    }
}));

setTimeout(function() {
    testGroup.start();
}, 1000);
