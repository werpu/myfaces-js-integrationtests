var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new myfaces._supportive.unittest.TestGroup(
        {
            description:"Multi form situation",
            postcondition: function() {

                this.autoForward("./finalResults.jsf")
                return true;
            }
        });

testGroup.addCase(new AjaxCase({
    description:"Multiform testing",
    defer: 2000,
    /*we enable global processing to handle a triggered click on the issuing control*/

    manualTearDown: true,
    _ajaxCnt: 0,

    setup: function() {
        this._timer = setInterval(this._Lang.hitch(this, function() {
            $("#first_input").val(Math.random());
            $("#second_input").val(Math.random());
        }),10);
    },
    precondition: function() {
        this._ajaxCnt = 1;
        return true;
    },
    run: function() {
        for (var cnt = 0; cnt < 100; cnt++) {
            if (cnt % 2) {
                this.ajaxRequest("first_input", null, {execute:'firstForm', render:'renderTarget1 renderTarget2'});
            } else {
                this.ajaxRequest("second_input", null, {execute:'firstForm', render:'renderTarget1 renderTarget2'});
            }
        }
    },
    postcondition: function() {

        if (this._ajaxCnt == 100) {
            this.assertTrue("postcondition reached after 100 requests, test has passed", true);
            clearInterval(this._timer);
            this.tearDown();
        }
        this._ajaxCnt++;
        return true;
    },

}));
setTimeout(function() {
    testGroup.start();
}, 100);
