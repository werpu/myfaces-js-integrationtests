$.fn.outerHTML = function(){

    // IE, Chrome & Safari will comply with the non-standard outerHTML, all others (FF) will have a fall-back for cloning
    return (!this.length) ? this : (this[0].outerHTML || (
      function(el){
          var div = document.createElement('div');
          div.appendChild(el.cloneNode(true));
          var contents = div.innerHTML;
          div = null;
          return contents;
    })(this[0]));

}

afterEach(function() {
    myfaces.testcases.forward("./test4-chain.jsf");
});
describe("Full body replacement via protocol view bpdy", function () {
    it("Should run the ajax and replace the body", function () {
        var htmlReporter = $("#HTMLReporter").outerHTML();
        runs(function () {
            emitPPR("form1", null, "body2");
        });
        waitsFor(function () {
            return myfaces.testcases.ajaxFinished;
        }, "Server timeout", 10000);
        runs(function(){
            var div = document.createElement("div");
            div.innerHTML = htmlReporter;
            document.body.appendChild(div);
        });
        runs(function(){
            var html = $("body").html();
            expect(html.indexOf("testResults59")).not.toBe(-1);
            expect(html.indexOf("Body replacement test successful")).not.toBe(-1);
        });
    });
});
