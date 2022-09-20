if (!AjaxCase) {

    var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

    var testGroup = new (_class("Test5ViewRoot", myfaces._supportive.unittest.TestGroup,
            {
                _description:"Chain Test",
                constructor_:function () {
                    this._callSuper("constructor_");
                },
                tearDown:function () {
                    this._callSuper("tearDown");
                    this.autoForward("./test6-tablebasic.jsf");
                }
            }))();
    testGroup.addCase(new AjaxCase({
        description:"Chain test",
        defer:3000,
        run:function () {
            this.ajaxRequest("allKeyword", null, {
                render:"@all",
                execute:"@all"
            });
        },
        postcondition:function () {
            this.assertTrue("resulting text found", $("body").html().indexOf("refresh successul2") != -1);
        }
    }));

    setTimeout(function () {
        testGroup.start();
    }, 1000);
}