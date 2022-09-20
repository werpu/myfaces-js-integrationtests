var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new (_class("Test15JSF22Delay", myfaces._supportive.unittest.TestGroup,
{
    _description:"Delay integration test",
    constructor_: function() {
        this._callSuper("constructor_");
    },
    tearDown: function() {
        this._callSuper("tearDown");
    //this.autoForward("./test10-doubleeval.jsf");

    }
}))();

testGroup.addCase(new AjaxCase({
    description:"Delay Test",
    defer: 1000,
    manualTearDown: true,

    precondition: function() {
        this._ajaxCnt = 1;
        return true;
    },
    run: function() {
        document.getElementById("testform").action = './test.timeout';
        this.ajaxRequest(document.getElementById("delayControl"), null, {
            execute:"delayControl",
            render:"delayoutput",
            op:"cleardelay"
        });
        for (var cnt = 0; cnt < 100; cnt++) {
            this.ajaxRequest(document.getElementById("delayControl"), null, {
                execute:"delayControl",
                render:"delayoutput", 
                op:"delay",
                delay:500
            });
        }
    },

    postcondition: function() {
        try {
            //we check for a clear 1 text in our result div
            //this.assertTrue("booga", true);
            this.assertTrue("Check for correct content", document.getElementById("delayoutput").innerHTML.indexOf("Number of requests so far 1") != -1);
        } finally {
            this.tearDown();
        }
        return true;
    }
}));

testGroup.addCase(new AjaxCase({
    description:"Delay Test not delayed",
    defer: 6000,
    manualTearDown: true,
    _timer : null,

    precondition: function() {
        this._ajaxCnt = 1;
        return true;
    },
    run: function() {
        document.getElementById("testform").action = './test.timeout';
        this.ajaxRequest(document.getElementById("delayControl"), null, {
            execute:"delayControl",
            render:"delayoutput",
            op:"cleardelay"
        });
        for (var cnt = 0; cnt < 10; cnt++) {
            this.ajaxRequest(document.getElementById("delayControl"), null, {
                execute:"delayControl",
                render:"delayoutput", 
                op:"delay",
                delay:0
            });
        }
    },

    postcondition: function() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer =  null;
        }
        var _t = this;
        this._timer = setTimeout(function() {
            try {
                //we check for a clear 1 text in our result div
                //this.assertTrue("booga", true);
                _t.assertTrue("Check for correct content", document.getElementById("delayoutput").innerHTML.indexOf("Number of requests so far 10") != -1);
            } finally {
                _t.tearDown();
            }
        }, 1000);
        return true;
    }
}));

setTimeout(function() {
    testGroup.start();
}, 100);

