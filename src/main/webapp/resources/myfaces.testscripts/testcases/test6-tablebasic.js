var TestCase = myfaces._supportive.unittest.TestCase;
var AjaxCase = myfaces._supportive.unittest.JSFAjaxTestCase;

var testGroup = new (_class("Testgroup6TableBasic", myfaces._supportive.unittest.TestGroup, {
    _description:"MyFaces JSF Protocol Tests with Table Target",

    constructor_: function() {
        this._callSuper("constructor_");
    },
    setup: function() {
        this._callSuper("setup");
        this.tableHTML = $("#table1").html();
    },
    postcondition: function() {
        this._callSuper("postcondition");

        return true;
    },

    tearDown: function() {
        this._callSuper("tearDown");
        //we are resetting the table to its original state
        this.tableHTML = $("#table1").html(this.tableHTML);
        this.autoForward("./test7-eventtest.jsf");
    },
    emitPPR: function(ajaxFunc, source, event, action, useIframe, formName) {
        document.getElementById(formName || "form2").action = target;

        if (arguments.length <= 4) {
            ajaxFunc(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {
                op:action
            });
        } else {
            ajaxFunc(/*String|Dom Node*/ source, /*|EVENT|*/ (window.event) ? window.event : event, /*{|OPTIONS|}*/ {
                op:action, 
                myfaces: {
                    transportType:"multipartQueuedPost"
                }
            });
    }
},
addStandardTestcase: function(description, origin, command, postCondition) {
    this.addCase(new AjaxCase({
        description: description,
        globalProcess: false,
        run: function() {
            this.attr("testGroup").emitPPR(this.ajaxRequest, origin, null, command);
        },
        postcondition: postCondition
    }));
}
}))();



testGroup.addStandardTestcase("Replace Head in table", "replace_head", "table_replace_head",
    function() {
        var headCol1 = $("#head_col1").html();
        var headCol2 = $("#head_col2").html();
        this.assertTrue("headcol1 replaced", headCol1.indexOf("replaced") != -1);
        this.assertTrue("headcol1 auto evaled", headCol1.indexOf("evaled") != -1);
        this.assertTrue("headcol2 replaced", headCol2.indexOf("replaced") != -1);
    }
    );

testGroup.addStandardTestcase("Replace body in table", "replace_body", "table_replace_body",
    function() {
        var col1 = $("#body_row1_col1").html();
        var col2 = $("#body_row1_col2").html();
        this.assertTrue("body col1 replaced", col1.indexOf("replaced") != -1);
        this.assertTrue("bpdy col1 auto evaled", col1.indexOf("evaled") != -1);
        this.assertTrue("body col2 replaced", col2.indexOf("replaced") != -1);
    }
    );

testGroup.addStandardTestcase("Insert Rows in head", "insert_row_head", "table_insert_row_head",
    function() {
        this.assertTrue("three rows now in head", $("#table1 thead tr").length >= 3);
        //check for insert before and after
        this.assertTrue("first element must be insert before", $("#table1 thead tr").first().hasClass("insert_before"));
        this.assertTrue("last element must be insert after", $("#table1 thead tr").last().hasClass("insert_after"));
    }
    );

testGroup.addStandardTestcase("Insert Rows in body", "insert_row_body", "table_insert_row_body",
    function() {
        this.assertTrue("three rows now in body", $("#table1 tbody tr").length >= 3);
        this.assertTrue("first element must be insert before", $("#table1 tbody tr").first().hasClass("insert_before"));
        this.assertTrue("last element must be insert after", $("#table1 tbody tr").last().hasClass("insert_after"));
    }
    );

testGroup.addStandardTestcase("Insert Column in head", "insert_column_head", "table_insert_column_head",
    function() {
        this.assertTrue("six columns in head or more", $("#table1 #head_row1 td").length >= 6);
        this.assertTrue("first element must be insert before", $("#table1 #head_row1 td").first().html().indexOf("inserted before") != -1);
        this.assertTrue("last element must be insert after", $("#table1 #head_row1 td").last().html().indexOf("inserted after") != -1);
    }

    );

testGroup.addStandardTestcase("Insert Column in head", "insert_column_head", "table_insert_column_head",
    function() {
        this.assertTrue("six columns in head or more", $("#table1 #head_row1 td").length >= 6);
        this.assertTrue("first element must be insert before", $("#table1 #head_row1 td").first().html().indexOf("inserted before") != -1);
        this.assertTrue("last element must be insert after", $("#table1 #head_row1 td").last().html().indexOf("inserted after") != -1);
    }
    );

testGroup.addStandardTestcase("Insert Column in body", "insert_column_body", "table_insert_column_body",
    function() {
        this.assertTrue("six columns in head or more", $("#table1 #body_row1 td").length >= 6);
        this.assertTrue("first element must be insert before", $("#table1 #body_row1 td").first().html().indexOf("inserted before") != -1);
        this.assertTrue("last element must be insert after", $("#table1 #body_row1 td").last().html().indexOf("inserted after") != -1);
    }
    );

testGroup.addStandardTestcase("Insert second body", "insert_body", "table_insert_body",
    function() {
        this.assertTrue("two bodies or more", $("#table1 tbody").length >= 2);
    }
    );

setTimeout(function() {
    testGroup.start();
}, 100);
