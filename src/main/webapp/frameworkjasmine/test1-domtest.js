var Dom = myfaces._impl._util._Dom;
afterEach(function(){
    setTimeout(function(){
        myfaces.testcases.redirect("./test2-inheritancetesting.jsf");
    }, 1000);
});
describe("Various dom util tests", function () {
    it("five divs under level1 (including it)", function () {
        var results = Dom.findByTagName(Dom.byId("level1"), "div", true);
        expect(results.length).toBe(5);
    });
    it("one element in form", function () {
        var results = Dom.findByTagName(Dom.byId("form1"), "input", true);
        expect(results.length).toBe(1);
    });
    it("Fuzzy form detection", function () {
        var results = Dom.fuzzyFormDetection(Dom.findByName(document, "blabla")[0]);
        expect(results).not.toBeNull();
    });
    it("Fuzzy form detection second case", function () {
        var results = Dom.fuzzyFormDetection(Dom.byId("blabla2"));
        expect(results).toBeNull();
    });
    it("Fuzzy form detection html5 case", function () {
        var results = Dom.fuzzyFormDetection(Dom.byId("blabla3"));
        expect(results).not.toBeNull();
    });
});
