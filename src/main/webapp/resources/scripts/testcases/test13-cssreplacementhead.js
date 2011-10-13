var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new (_class("Test13CSSReplacementHead", myfaces._supportive.unittest.TestGroup,
        {
            _description:"CSS Replacement testcase",

            constructor_: function() {
                this._callSuper("constructor_");
            },
            tearDown: function() {
                this._callSuper("tearDown");
                this.autoForward("./test14-multiform.jsf");

            }
        }))();
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
