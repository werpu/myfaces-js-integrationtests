afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("test23-separator.jsf");
    }, 1000);
});
describe("jsf.separator api test", function(){
    it("Checks for a separator char being set after page load", function() {
        //custom separator sent from the server
        expect(jsf.separatorchar == "|").toBeTruthy();
    });
});