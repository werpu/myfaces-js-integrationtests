afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("test24-resetvalues.jsf");
    }, 1000);
});
describe("jsf.separator api test 2", function () {
    it("Checks for a default separator char being set after page load", function () {
        //default nothing from server
        expect(jsf.separatorchar == ":").toBeTruthy();
    });
});