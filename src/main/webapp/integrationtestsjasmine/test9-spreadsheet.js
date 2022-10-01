afterEach(function () {
    setTimeout(function () {
        myfaces.testcases.redirect("./test10-doubleeval.jsf");
    }, 1000);
});
describe("Spreadsheet test for the replacement of table elements", function () {
    it("Runs the spreadsheet test", function (done) {
        let start;
        var promises =  [];
        for (var cnt = 0; cnt < 100; cnt++) {
            //first we set 100 values
            var currentField1 = "#testTable2\\"+faces.separatorchar + cnt + "\\"+faces.separatorchar+"input1";
            var currentField2 = "#testTable2\\"+faces.separatorchar+ cnt + "\\"+faces.separatorchar+"input2";
            var currentOutput2 = "testTable2"+faces.separatorchar + cnt + faces.separatorchar+"field1";
            var currentOutput1 = "testTable2"+faces.separatorchar + cnt + faces.separatorchar+"field2";
            var origin = "testTable2"+faces.separatorchar + cnt + faces.separatorchar+"submitall";

            $(currentField1).val("value1:" + cnt);
            $(currentField2).val("value2:" + cnt);
            //secondly we issue 100 requests
            currentField2 = currentField2.replace("#", "").replace(/\\/g, "");
            currentField1 = currentField1.replace("#", "").replace(/\\/g, "");
            start = Date.now();
            promises.push(jsfAjaxRequestPromise(origin, null, {
                execute: currentField2 + " " + currentField1,
                render: currentOutput1 + " " + currentOutput2,
                'jakarta.faces.behavior.event': 'action'
            }));
        }
        Promise.all(promises).finally(function() {
            setTimeout(function () {

                for (var cnt = 0; cnt < 100; cnt++) {

                    var currentOutput1 = "#testTable2"+faces.separatorchar + cnt + faces.separatorchar+"field1";
                    var currentOutput2 = "#testTable2"+faces.separatorchar + cnt + faces.separatorchar+"field2";
                    var assert1 = $(currentOutput1).html().indexOf("value1:" + cnt) != -1;
                    var assert2 = $(currentOutput2).html().indexOf("value2:" + cnt) != -1;

                    expect( assert1 && assert2).toBeTruthy(); //field must have ajax content

                }
                console.log("Processing time last request:"+(Date.now() - 500 - start))
                done();

            }, 500);
        });



    });
});