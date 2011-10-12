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
    description:"Replacement Testcase",
    defer: 2000,
    precondition: function() {
        return true;
    },
    run: function() {
        this.ajaxRequest('nextPage', null, {execute:'mainForm',render:'@all','javax.faces.behavior.event':'action'});
    },
    postcondition: function() {
        this.assertTrue("div1 has no width anymore", $("#div1").width() > 120);
        this.assertTrue("div2 has no width anymore", $("#div2").width() > 120);
        this.assertTrue("div3 has no width anymore", $("#div3").width() > 120);
        this.assertTrue("div4 has a width", $("#div4").width() < 120);
        this.assertTrue("div5 has a width", $("#div5").width() < 120);
        this.assertTrue("div6 has a width", $("#div6").width() < 120);
        this.assertTrue("div6 has a width", $("#div7").width() < 120);
    }
}));

setTimeout(function() {
    testGroup.start();
}, 1000);
