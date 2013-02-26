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

describe("Full root replacement via protocol view root", function () {
    it("Should run the ajax and replace the viewroot", function () {
        var htmlReporter = $("#HTMLReporter").outerHTML();
        runs(function () {
            emitPPR("form1", null, "body");
        });
        waitsFor(function () {
            return myfaces.testcases.ajaxFinished;
        }, "Server timeout", 10000);
        runs(function(){
          var div = document.createElement("div");
          div.innerHTML = htmlReporter;
          document.body.appendChild(div);
          expect($("#scriptreceiver").html().indexOf("hello from embedded script")).not.toBe(-1);
        });
    });
});
